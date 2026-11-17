import localHome from "@/content/settings/home.json";
import { publicGitHubRequest, publicRepository } from "./public-github";

export type HomeContent = typeof localHome;

// Independent defaults also keep the page usable when the local CMS document is empty.
const defaultHome: HomeContent = {
  banner_slogan: "",
  hero_heading: "Frei stehen. Länger bleiben. Smart ausgestattet.",
  hero_intro: "Unabhängige Vergleiche für Strom, Internet, Kühlung und Wasser – damit dein Camper wirklich autark wird.",
  primary_button: "Stromrechner starten",
  secondary_button: "Powerstationen vergleichen",
  guides_heading: "Neu im Ratgeber",
  guides_intro: "Entdecke unsere Ratgeber und Vergleiche für autarkes Camping.",
};

export function parseHomeContent(raw: string, fallback: HomeContent = defaultHome): HomeContent {
  if (raw.length > 100_000) throw new Error("Homepage content too large");
  if (!raw.trim()) return { ...fallback };
  const data: unknown = JSON.parse(raw);
  if (!data || typeof data !== "object" || Array.isArray(data)) throw new Error("Invalid homepage content");
  const values = data as Record<string, unknown>;
  const result = { ...fallback };
  for (const key of Object.keys(defaultHome) as (keyof HomeContent)[]) {
    const value = values[key];
    if (value === undefined) continue;
    if (typeof value !== "string" || value.length > (key === "guides_intro" || key === "hero_intro" ? 20_000 : 2_000)) throw new Error("Invalid homepage text");
    result[key] = value.trim() || (key === "banner_slogan" ? "" : fallback[key]);
  }
  return result;
}

// Never crash the page on module load, even for an invalid local CMS document.
export const homeContent: HomeContent = (() => {
  try { return parseHomeContent(JSON.stringify(localHome)); } catch { return { ...defaultHome }; }
})();

export async function fetchLiveHome(fetcher: typeof fetch = fetch): Promise<HomeContent> {
  const request = publicGitHubRequest(fetcher);
  const { repo, branch } = await publicRepository(request);
  const response = await request(`https://api.github.com/repos/${repo}/contents/src/content/settings/home.json?ref=${encodeURIComponent(branch)}`, "application/vnd.github.raw+json");
  return parseHomeContent(await response.text(), homeContent);
}