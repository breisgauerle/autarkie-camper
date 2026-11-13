import { parse } from "yaml";
import type { Article } from "./content";
import { parseArticleFile } from "./article-parser";

export async function fetchLiveArticles(fallback: Article[], fetcher: typeof fetch = fetch): Promise<Article[]> {
  const request = async (url: string, accept = "application/vnd.github+json") => {
    const response = await fetcher(url, { headers: { Accept: accept }, credentials: "omit", redirect: "error", cache: "no-store", signal: AbortSignal.timeout(15000) });
    if (!response.ok) throw new Error(`Public content unavailable (${response.status})`);
    return response;
  };
  const config = parse(await (await request("/admin/config.yml", "text/plain")).text());
  const repo: unknown = config?.backend?.repo;
  const branch: unknown = config?.backend?.branch;
  if (typeof repo !== "string" || !/^[\w-]+\/[\w.-]+$/.test(repo) || typeof branch !== "string" || !/^[\w./-]{1,100}$/.test(branch)) throw new Error("Invalid public repository configuration");
  const tree = await (await request(`https://api.github.com/repos/${repo}/git/trees/${encodeURIComponent(branch)}?recursive=1`)).json();
  if (!Array.isArray(tree.tree) || tree.truncated) throw new Error("Incomplete public article tree");
  const files: { path: string; sha: string }[] = tree.tree.filter((file: { path?: unknown; sha?: unknown; type?: unknown }) => file.type === "blob" && typeof file.path === "string" && /^src\/content\/articles\/[^/]+\.md$/.test(file.path) && typeof file.sha === "string" && /^[a-f0-9]{40,64}$/.test(file.sha));
  const result: Article[] = [];
  let cursor = 0;
  await Promise.all(Array.from({ length: Math.min(4, files.length) }, async () => {
    while (cursor < files.length) {
      const file = files[cursor++];
      if (!file) continue;
      const slug = file.path.slice("src/content/articles/".length, -3);
      try {
        const blob = await (await request(`https://api.github.com/repos/${repo}/git/blobs/${file.sha}`)).json();
        if (blob.encoding !== "base64" || typeof blob.content !== "string" || blob.size > 2_000_000) throw new Error("Invalid article blob");
        const bytes = Uint8Array.from(atob(blob.content.replace(/\s/g, "")), c => c.charCodeAt(0));
        result.push(parseArticleFile(new TextDecoder().decode(bytes), slug, `https://raw.githubusercontent.com/${repo}/${encodeURIComponent(branch)}/public/`));
      } catch {
        const local = fallback.find(article => article.slug === slug);
        if (local) result.push(local);
      }
    }
  }));
  // A failed refresh must never erase the usable local site.
  if (files.length && !result.length) throw new Error("No readable public articles");
  return result.sort((a, b) => b.date.localeCompare(a.date));
}