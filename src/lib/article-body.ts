import { Marked, type Token, type Tokens } from "marked";
import { productAffiliateLinks, type AffiliateLink } from "./affiliate-links";

export const SHOP_LABELS = ["Bei Fritz Berger ansehen", "Bei Camping Wagner prüfen", "Bei Amazon ansehen"] as const;
export type AffiliateBoxData = { product: string; price: string; offers: AffiliateLink[] };
export type ArticleBlock = { type: "html"; html: string } | { type: "affiliate"; box: AffiliateBoxData };

export function parseAffiliateBox(source: string): AffiliateBoxData | undefined {
  try {
    const data: unknown = JSON.parse(source);
    if (!data || typeof data !== "object" || Array.isArray(data)) return undefined;
    const values = data as Record<string, unknown>;
    if (typeof values["product"] !== "string" || !values["product"].trim()) return undefined;
    const affiliate_links = SHOP_LABELS.map((fallback, index) => {
      const label = values[`shop${index + 1}_name`];
      const url = values[`shop${index + 1}_url`];
      return { label: typeof label === "string" && label.trim() ? label : fallback, url: typeof url === "string" ? url.trim() : "" };
    });
    return { product: values["product"].trim(), price: typeof values["price"] === "string" ? values["price"].trim() : "", offers: productAffiliateLinks({ affiliate_links }) };
  } catch { return undefined; }
}

const markdown = new Marked({ gfm: true, breaks: false });
const escapeHtml = (value: string) => value.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c);
const safeMarkdownUrl = (url: string) => /^(https?:\/\/|\/?uploads\/|\/[^/]|#[\w-])/.test(url) && !/[\u0000-\u0020]/.test(url);
markdown.use({ renderer: {
  html(token) { return escapeHtml(token.text); },
  link(token) { const text = this.parser.parseInline(token.tokens); return safeMarkdownUrl(token.href) ? `<a href="${escapeHtml(token.href)}">${text}</a>` : text; },
  image(token) { return safeMarkdownUrl(token.href) ? `<img src="${escapeHtml(token.href)}" alt="${escapeHtml(token.text)}" loading="lazy">` : escapeHtml(token.text); },
  table(token: Tokens.Table) {
  const cell = (value: Tokens.TableCell, tag: "th" | "td") => `<${tag}${tag === "th" ? ' scope="col"' : ""}${value.align ? ` class="table-${value.align}"` : ""}>${this.parser.parseInline(value.tokens)}</${tag}>`;
  return `<div class="article-table-scroll" role="region" aria-label="Vergleichstabelle" tabindex="0"><table><thead><tr>${token.header.map(value => cell(value, "th")).join("")}</tr></thead><tbody>${token.rows.map(row => `<tr>${row.map(value => cell(value, "td")).join("")}</tr>`).join("")}</tbody></table></div>`;
} } });

export function parseArticleBody(source: string): ArticleBlock[] {
  const blocks: ArticleBlock[] = [];
  let pending: Token[] = [];
  const flush = () => {
    if (pending.length) blocks.push({ type: "html", html: markdown.parser(Object.assign(pending, { links: tokens.links })) });
    pending = [];
  };
  const tokens = markdown.lexer(source);
  for (const token of tokens) {
    if (token.type === "code" && token.lang === "produkt-kaufbox") {
      flush();
      const box = parseAffiliateBox(token.text);
      if (box) blocks.push({ type: "affiliate", box });
    } else pending.push(token);
  }
  flush();
  return blocks;
}