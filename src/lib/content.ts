import { type ArticleBlock } from "./article-body";
import { parseArticleFile } from "./article-parser";
import settingsJson from "@/content/settings/site.json";
import type { AffiliateLink } from "./affiliate-links";

export type Product = {
  slug: string; name: string; category: string; type: string; capacity_wh: number; image?: string;
  specs: { label: string; value: string }[]; pros: string[]; cons: string[];
  merchant_url?: string; amazon_asin?: string; affiliate_links?: AffiliateLink[];
};
export type Article = {
  slug: string; title: string; date: string; category: string; type: string; image?: string;
  summary: string; seo_title?: string; seo_description?: string; blocks: ArticleBlock[];
};
export type Settings = typeof settingsJson;
export const settings: Settings = settingsJson;

const productFiles = import.meta.glob<Omit<Product, "slug">>("/src/content/products/*.json", { eager: true, import: "default" });
export const products: Product[] = Object.entries(productFiles)
  .map(([p, d]) => ({ ...d, slug: (p.split("/").pop() ?? "").replace(".json", "") }))
  .sort((a, b) => a.name.localeCompare(b.name));

const articleFiles = import.meta.glob<string>("/src/content/articles/*.md", { eager: true, query: "?raw", import: "default" });
export const articles: Article[] = Object.entries(articleFiles)
  .map(([p, raw]) => {
    return parseArticleFile(raw, (p.split("/").pop() ?? "").replace(".md", ""));
  })
  .sort((a, b) => b.date.localeCompare(a.date));

export function amazonUrl(asin?: string) {
  if (!asin) return "";
  const tag = settings.amazon_tag ? `?tag=${encodeURIComponent(settings.amazon_tag)}` : "";
  return `https://www.amazon.de/dp/${asin}${tag}`;
}
