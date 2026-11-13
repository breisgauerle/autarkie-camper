import { parseArticleBody } from "./article-body";
import type { Article } from "./content";

export function parseArticleFile(raw: string, slug: string, mediaBase?: string): Article {
  const end = raw.search(/\n\}\s*(\n|$)/) + 2;
  if (end < 2) throw new Error("Invalid article frontmatter");
  const meta: unknown = JSON.parse(raw.slice(0, end));
  if (!meta || typeof meta !== "object" || Array.isArray(meta)) throw new Error("Invalid article metadata");
  const data = meta as Record<string, unknown>;
  for (const key of ["title", "date", "category", "type", "summary"]) {
    if (typeof data[key] !== "string") throw new Error("Missing article metadata");
  }
  if (!data["title"] || !Number.isFinite(Date.parse(String(data["date"])))) throw new Error("Invalid title or date");
  const image = typeof data["image"] === "string" && /^(https:\/\/|\/?uploads\/|\/[^/])/.test(data["image"]) ? data["image"] : undefined;
  const resolveMedia = (url: string) => mediaBase && /^\/?uploads\//.test(url) ? new URL(url.replace(/^\//, ""), mediaBase).href : url;
  const blocks = parseArticleBody(raw.slice(end));
  if (mediaBase) for (const block of blocks) {
    if (block.type === "html") block.html = block.html.replace(/src="(\/?uploads\/[^"<>]+)"/g, (_, path: string) => `src="${resolveMedia(path)}"`);
  }
  return { slug, title: String(data["title"]), date: String(data["date"]), category: String(data["category"]), type: String(data["type"]), summary: String(data["summary"]),
    ...(image ? { image: resolveMedia(image) } : {}),
    ...(typeof data["seo_title"] === "string" ? { seo_title: data["seo_title"] } : {}),
    ...(typeof data["seo_description"] === "string" ? { seo_description: data["seo_description"] } : {}), blocks };
}