import localHome from "@/content/settings/home.json";
import { publicGitHubRequest, publicRepository } from "./public-github";

export type HomeContent = typeof localHome;

export function parseHomeContent(raw: string): HomeContent {
  if (raw.length > 50_000) throw new Error("Homepage content too large");
  const data: unknown = JSON.parse(raw);
  if (!data || typeof data !== "object" || Array.isArray(data)) throw new Error("Invalid homepage content");
  const values = data as Record<string, unknown>;
  const result = { ...localHome };
  for (const key of Object.keys(localHome) as (keyof HomeContent)[]) {
    const value = values[key];
    const optional = key === "banner_slogan" || key === "guides_intro";
    if (optional && value === undefined) { result[key] = ""; continue; }
    if (typeof value !== "string" || value.length > 2_000 || (!optional && !value.trim())) throw new Error("Invalid homepage text");
    result[key] = value.trim();
  }
  return result;
}

export const homeContent = parseHomeContent(JSON.stringify(localHome));

export async function fetchLiveHome(fetcher: typeof fetch = fetch): Promise<HomeContent> {
  const request = publicGitHubRequest(fetcher);
  const { repo, branch } = await publicRepository(request);
  const response = await request(`https://api.github.com/repos/${repo}/contents/src/content/settings/home.json?ref=${encodeURIComponent(branch)}`, "application/vnd.github.raw+json");
  return parseHomeContent(await response.text());
}