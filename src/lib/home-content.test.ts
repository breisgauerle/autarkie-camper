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
    expect(() => parseHomeContent(JSON.stringify({ ...homeContent, hero_intro: " " }))).toThrow();
  });
  it("allows empty optional slogans and strips unknown fields", () => {
    const { banner_slogan, guides_intro, ...required } = homeContent;
    expect(parseHomeContent(JSON.stringify({ ...required, unknown: "discard" }))).toEqual({ ...required, banner_slogan: "", guides_intro: "" });
  });
});