import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { describe, expect, it } from "vitest";
import { parseAffiliateBox, parseArticleBody, SHOP_LABELS } from "./article-body";

type Editor = { fields: { name: string; default?: string }[]; pattern: RegExp; toBlock: (data: Record<string, string>) => string; fromBlock: (match: RegExpMatchArray) => Record<string, string>; toPreview: (data: Record<string, string>) => string };
function editor(): Editor {
  let registered: Editor | undefined;
  runInNewContext(readFileSync("public/admin/affiliate-box.js", "utf8"), { CMS: { registerEditorComponent: (value: Editor) => { registered = value; } }, URL });
  if (!registered) throw new Error("No purchase box registered");
  return registered;
}

describe("Article purchase boxes", () => {
  it("does not execute public Markdown HTML or executable destinations", () => {
    const blocks = parseArticleBody('<script>alert(1)</script>\n\n[Bad](javascript:alert%281%29)\n\n![Bad](data:text/html,bad)');
    const html = blocks.filter(block => block.type === "html").map(block => block.html).join("");
    expect(html).not.toContain("<script>");
    expect(html).not.toContain('href="javascript:');
    expect(html).not.toContain('src="data:');
  });
  it("round-trips all editor fields into three named frontend offers", () => {
    const widget = editor();
    const data = { product: 'Dometic CFX3 35 "Pro"', price: "ca. 849 €", shop1_name: "Shop A", shop1_url: "https://shop-a.example/p", shop2_name: "Shop B", shop2_url: "https://shop-b.example/p", shop3_name: "Amazon", shop3_url: "https://www.amazon.de/dp/B0B6GQ2C5P?tag=autarkie-21" };
    const source = widget.toBlock(data);
    const match = source.match(widget.pattern);
    if (!match) throw new Error("Editor failed to recognize its own block");
    expect(widget.fromBlock(match)).toEqual(data);
    const blocks = parseArticleBody(`## Empfehlung\n\n${source}\n\nWeiterer Text.`);
    expect(blocks.map(block => block.type)).toEqual(["html", "affiliate", "html"]);
    const block = blocks[1];
    if (block?.type !== "affiliate") throw new Error("Missing purchase box");
    expect(block.box).toEqual({ product: data.product, price: "ca. 849 €", offers: [
      { label: "Shop A", url: data.shop1_url }, { label: "Shop B", url: data.shop2_url }, { label: "Amazon", url: data.shop3_url },
    ] });
  });
  it("uses the requested three default shop names", () => {
    expect(editor().fields.filter(field => field.name.endsWith("_name")).map(field => field.default)).toEqual(["Bei Fritz Berger ansehen", "Bei Camping Wagner prüfen", "Bei Amazon ansehen"]);
    const blocks = parseArticleBody(editor().toBlock({ product: "Kühlbox", shop3_url: "https://amazon.de/p" }));
    expect(blocks[0]).toEqual({ type: "affiliate", box: { product: "Kühlbox", price: "", offers: [{ label: SHOP_LABELS[2], url: "https://amazon.de/p" }] } });
  });
  it("hides empty links and rejects unsafe or credential-bearing destinations", () => {
    const box = parseAffiliateBox(JSON.stringify({ product: "Kühlbox", shop1_url: "", shop2_url: "javascript:alert(1)", shop3_url: "https://user:secret@shop.example/p" }));
    expect(box?.offers).toEqual([]);
    expect(parseAffiliateBox(JSON.stringify({ product: "Kühlbox", shop1_url: "https://shop.example/p", shop4_url: "https://extra.example/p" }))?.offers).toHaveLength(1);
  });
  it("ignores malformed purchase data without breaking surrounding article content", () => {
    const blocks = parseArticleBody('Before\n\n```produkt-kaufbox\n{broken}\n```\n\nAfter');
    expect(blocks.map(block => block.type)).toEqual(["html", "html"]);
    expect(parseAffiliateBox('{"product":""}')).toBeUndefined();
  });
  it("does not activate a purchase box embedded in a normal code example", () => {
    const blocks = parseArticleBody('````markdown\n' + editor().toBlock({ product: "Example" }) + '\n````');
    expect(blocks.map(block => block.type)).toEqual(["html"]);
  });
  it("preserves Markdown reference destinations across purchase boxes", () => {
    const blocks = parseArticleBody('[Details][shop]\n\n' + editor().toBlock({ product: "Kühlbox" }) + '\n\n[shop]: https://shop.example/details');
    const block = blocks[0];
    if (block?.type !== "html") throw new Error("Missing article paragraph");
    expect(block.html).toContain('href="https://shop.example/details"');
  });
  it("escapes editor preview values and does not expose executable links", () => {
    const preview = editor().toPreview({ product: '<img src=x onerror=alert(1)>', price: '<script>bad</script>', shop1_url: "javascript:alert(1)" });
    expect(preview).not.toContain("<img");
    expect(preview).not.toContain("<script>");
    expect(preview).not.toContain("javascript:");
  });
});