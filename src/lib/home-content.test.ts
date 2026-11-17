import { describe, expect, it, vi } from "vitest";
import { fetchLiveHome, homeContent, parseHomeContent } from "./home-content";

describe("Homepage GitHub content", () => {
  it("loads the published Settings / Home document from the configured branch without credentials", async () => {
    const published = { ...homeContent, hero_heading: "Autark unterwegs", banner_slogan: "Sommer im Camper", guides_intro: "Unsere neuesten Tests" };
    const fetcher = vi.fn(async (url: string | URL | Request) => String(url) === "/admin/config.yml"
      ? new Response("backend:\n  repo: breisgauerle/autarkie-camper\n  branch: main")
      : new Response(JSON.stringify(published)));
    expect(await fetchLiveHome(fetcher as typeof fetch)).toEqual(published);
    expect(fetcher.mock.calls[1]?.[0]).toBe("https://api.github.com/repos/breisgauerle/autarkie-camper/contents/src/content/settings/home.json?ref=main");
    for (const [, options] of fetcher.mock.calls as unknown as [string, RequestInit][]) {
      expect(options.credentials).toBe("omit");
      expect(options.redirect).toBe("error");
      expect(options.headers).not.toHaveProperty("Authorization");
      expect(options.cache).toBe("no-store");
    }
  });
  it("rejects unavailable GitHub content so the page retains its local fallback", async () => {
    const fetcher = vi.fn(async (url: string | URL | Request) => String(url) === "/admin/config.yml"
      ? new Response("backend:\n  repo: breisgauerle/autarkie-camper\n  branch: main") : new Response("Not found", { status: 404 }));
    await expect(fetchLiveHome(fetcher as typeof fetch)).rejects.toThrow("404");
  });
  it("rejects malformed documents and non-text fields", () => {
    expect(() => parseHomeContent("not json")).toThrow();
    expect(() => parseHomeContent(JSON.stringify({ ...homeContent, hero_heading: { html: "unsafe" } }))).toThrow();
    expect(() => parseHomeContent(JSON.stringify({ ...homeContent, hero_intro: [] }))).toThrow();
  });
  it("keeps an empty slogan, falls back for missing text and strips unknown fields", () => {
    const { banner_slogan, guides_intro, ...required } = homeContent;
    expect(parseHomeContent(JSON.stringify({ ...required, unknown: "discard" }), homeContent)).toEqual({ ...required, banner_slogan: "", guides_intro: homeContent.guides_intro });
  });
  it.each(["", "  \n", "{}"])("uses readable fallback texts for an empty document: %j", raw => {
    expect(parseHomeContent(raw, homeContent)).toEqual(homeContent);
  });
  it("falls back for blank fields without discarding valid saved fields", () => {
    expect(parseHomeContent(JSON.stringify({ hero_heading: "Neue Überschrift", hero_intro: "  ", guides_intro: "\n" }), homeContent))
      .toEqual({ ...homeContent, hero_heading: "Neue Überschrift" });
  });
  it("preserves saved Markdown for both introductory texts", () => {
    const text = "## Autark unterwegs\n\n**Freiheit** genießen.\n\nEin zweiter Absatz.";
    const result = parseHomeContent(JSON.stringify({ hero_intro: text, guides_intro: text }), homeContent);
    expect(result.hero_intro).toBe(text);
    expect(result.guides_intro).toBe(text);
  });
  it("loads an empty published file with local defaults", async () => {
    const fetcher = vi.fn(async (url: string | URL | Request) => String(url) === "/admin/config.yml"
      ? new Response("backend:\n  repo: breisgauerle/autarkie-camper\n  branch: main") : new Response(""));
    expect(await fetchLiveHome(fetcher as typeof fetch)).toEqual(homeContent);
  });
});
describe("long homepage intro", () => {
  it("accepts an intro text longer than 2000 characters", () => {
    expect(parseHomeContent(JSON.stringify({ ...homeContent, guides_intro: "a".repeat(2191) })).guides_intro).toHaveLength(2191);
  });
});
