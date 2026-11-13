import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { ArticleBody } from "./ArticleBody";
import { parseArticleBody } from "@/lib/article-body";

afterEach(cleanup);
it("renders at most three affiliate destinations with the requested safe navigation attributes", () => {
  const values = { product: "Dometic CFX3 35", price: "ca. 849 €", shop1_name: "Shop A", shop1_url: "https://shop-a.example/p", shop2_name: "Shop B", shop2_url: "https://shop-b.example/p", shop3_name: "Amazon", shop3_url: "https://amazon.de/p", shop4_url: "https://extra.example/p" };
  render(<ArticleBody blocks={parseArticleBody('```produkt-kaufbox\n' + JSON.stringify(values) + '\n```')} />);
  const links = screen.getAllByRole("link");
  expect(links.map(link => link.getAttribute("href"))).toEqual([values.shop1_url, values.shop2_url, values.shop3_url]);
  for (const link of links) {
    expect(link).toHaveAttribute("target", "_blank");
    expect(link.getAttribute("rel")?.split(" ")).toEqual(expect.arrayContaining(["nofollow", "sponsored", "noopener", "noreferrer"]));
  }
});
it("renders no buttons when every link field is empty", () => {
  render(<ArticleBody blocks={parseArticleBody('```produkt-kaufbox\n{"product":"Dometic CFX3 35"}\n```')} />);
  expect(screen.queryAllByRole("link")).toHaveLength(0);
});