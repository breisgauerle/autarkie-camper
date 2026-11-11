export type AffiliateLink = { label: string; url: string };
export type ProductOffers = {
  affiliate_links?: AffiliateLink[];
  merchant_url?: string;
  amazon_asin?: string;
};

function safeUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password;
  } catch { return false; }
}

export function productAffiliateLinks(product: ProductOffers, amazonTag = ""): AffiliateLink[] {
  // An explicit list replaces legacy offers, including when deliberately empty.
  if (Array.isArray(product.affiliate_links)) {
    return product.affiliate_links.filter(link => typeof link?.label === "string" && link.label.trim() && typeof link.url === "string" && safeUrl(link.url))
      .slice(0, 3).map(link => ({ label: link.label.trim(), url: link.url }));
  }
  const links: AffiliateLink[] = [];
  if (product.merchant_url && safeUrl(product.merchant_url)) links.push({ label: "Beim Fachhändler", url: product.merchant_url });
  if (product.amazon_asin && /^[A-Z0-9]{10}$/.test(product.amazon_asin)) {
    links.push({ label: "Bei Amazon ansehen", url: `https://www.amazon.de/dp/${product.amazon_asin}${amazonTag ? `?tag=${encodeURIComponent(amazonTag)}` : ""}` });
  }
  return links;
}