import { render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { ProductCard } from "./ProductCard";

vi.mock("@/lib/content", () => ({ settings: { amazon_tag: "" } }));

it("renders the three configured affiliate destinations without legacy links", () => {
  render(<ProductCard p={{ slug: "test", name: "Testprodukt", category: "strom-solar", type: "powerstation", capacity_wh: 0, specs: [], pros: [], cons: [],
    merchant_url: "https://legacy.example/product",
    affiliate_links: [
      { label: "Shop A", url: "https://shop-a.example/product" },
      { label: "Shop B", url: "https://shop-b.example/product" },
      { label: "Amazon", url: "https://www.amazon.de/dp/B0B6GQ2C5P?tag=autarkie-21" },
    ],
  }} />);
  expect(screen.getAllByRole("link").map(link => link.getAttribute("href"))).toEqual([
    "https://shop-a.example/product", "https://shop-b.example/product", "https://www.amazon.de/dp/B0B6GQ2C5P?tag=autarkie-21",
  ]);
});