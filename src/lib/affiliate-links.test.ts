import { describe, expect, it } from "vitest";
import { productAffiliateLinks } from "./affiliate-links";

describe("Product affiliate offers", () => {
  it("limits a product to three offers with its own button labels", () => {
    const affiliate_links = ["Shop A", "Shop B", "Amazon", "Shop D"].map((label, index) => ({ label, url: `https://shop.example/${index}` }));
    expect(productAffiliateLinks({ affiliate_links })).toEqual(affiliate_links.slice(0, 3));
  });
  it("replaces rather than appends legacy offers", () => {
    expect(productAffiliateLinks({ affiliate_links: [{ label: "Shop A", url: "https://shop.example/a" }], merchant_url: "https://shop.example/old", amazon_asin: "B0B6GQ2C5P" })).toHaveLength(1);
    expect(productAffiliateLinks({ affiliate_links: [], merchant_url: "https://shop.example/old" })).toEqual([]);
  });
  it("preserves existing merchant and automatically tagged Amazon offers", () => {
    expect(productAffiliateLinks({ merchant_url: "https://shop.example/a", amazon_asin: "B0B6GQ2C5P" }, "autarkie-21")).toEqual([
      { label: "Beim Fachhändler", url: "https://shop.example/a" },
      { label: "Bei Amazon ansehen", url: "https://www.amazon.de/dp/B0B6GQ2C5P?tag=autarkie-21" },
    ]);
  });
  it("rejects executable and credential-bearing links", () => {
    expect(productAffiliateLinks({ affiliate_links: [{ label: "Bad", url: "javascript:alert(1)" }, { label: "Secret", url: "https://user:pass@shop.example/" }] })).toEqual([]);
  });
});