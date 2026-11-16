import { parse } from "yaml";

export function publicGitHubRequest(fetcher: typeof fetch) {
  return async (url: string, accept = "application/vnd.github+json") => {
    const response = await fetcher(url, { headers: { Accept: accept }, credentials: "omit", redirect: "error", cache: "no-store", signal: AbortSignal.timeout(15000) });
    if (!response.ok) throw new Error(`Public content unavailable (${response.status})`);
    return response;
  };
}

export async function publicRepository(request: ReturnType<typeof publicGitHubRequest>) {
  const config = parse(await (await request("/admin/config.yml", "text/plain")).text());
  const repo: unknown = config?.backend?.repo;
  const branch: unknown = config?.backend?.branch;
  if (typeof repo !== "string" || !/^[\w-]+\/[\w.-]+$/.test(repo) || typeof branch !== "string" || !/^[\w./-]{1,100}$/.test(branch)) throw new Error("Invalid public repository configuration");
  return { repo, branch };
}