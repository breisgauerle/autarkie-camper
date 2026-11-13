import { describe, expect, it, vi } from "vitest";
import { fetchLiveArticles } from "./live-articles";
import { parseArticleFile } from "./article-parser";

const source = (title = "Neue Kühlbox") => JSON.stringify({ title, date: "2026-11-13", category: "kuehlung-kochen", type: "testbericht", summary: "Praxistest", image: "/uploads/box.jpg" }, null, 2) + '\n\n## Vergleich\n\n```produkt-kaufbox\n{"product":"Dometic","shop1_url":"https://shop.example/p"}\n```';
const sha = "a".repeat(40);
const local = parseArticleFile(source("Lokale Kühlbox"), "kuehlbox");
function mockFetch(status = 200, raw = source()) {
  return vi.fn(async (url: string | URL | Request) => {
    if (url === "/admin/config.yml") return new Response("backend:\n  repo: breisgauerle/autarkie-camper\n  branch: main");
    if (String(url).includes("/git/trees/")) return new Response(JSON.stringify({ tree: [{ type: "blob", path: "src/content/articles/kuehlbox.md", sha }] }), { status });
    return new Response(JSON.stringify({ encoding: "base64", content: btoa(unescape(encodeURIComponent(raw))), size: raw.length }));
  });
}
describe("Public GitHub articles", () => {
  it("loads new published article data and purchase boxes instead of stale local files", async () => {
    const fetcher = mockFetch();
    const result = await fetchLiveArticles([local], fetcher as typeof fetch);
    expect(result[0]?.title).toBe("Neue Kühlbox");
    expect(result[0]?.category).toBe("kuehlung-kochen");
    expect(result[0]?.image).toBe("https://raw.githubusercontent.com/breisgauerle/autarkie-camper/main/public/uploads/box.jpg");
    expect(result[0]?.blocks[1]).toEqual({ type: "affiliate", box: { product: "Dometic", price: "", offers: [{ label: "Bei Fritz Berger ansehen", url: "https://shop.example/p" }] } });
    for (const [, options] of fetcher.mock.calls as unknown as [string, RequestInit][]) {
      expect(options.credentials).toBe("omit");
      expect(options.headers).not.toHaveProperty("Authorization");
      expect(options.redirect).toBe("error");
    }
  });
  it("keeps a failed public refresh separate so the provider can preserve local fallback", async () => {
    await expect(fetchLiveArticles([local], mockFetch(404) as typeof fetch)).rejects.toThrow("404");
  });
  it("preserves the local version when a published article is malformed", async () => {
    expect(await fetchLiveArticles([local], mockFetch(200, "invalid") as typeof fetch)).toEqual([local]);
  });
  it("omits deleted articles after a successful authoritative refresh", async () => {
    const fetcher = vi.fn(async (url: string | URL | Request) => url === "/admin/config.yml" ? new Response("backend:\n  repo: breisgauerle/autarkie-camper\n  branch: main") : new Response('{"tree":[]}'));
    expect(await fetchLiveArticles([local], fetcher as typeof fetch)).toEqual([]);
  });
});