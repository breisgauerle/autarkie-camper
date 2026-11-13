import { readdir, readFile, access } from "node:fs/promises";
import { join, resolve } from "node:path";

const directory = resolve(process.argv[2] ?? "dist/client");
const articles = (await readdir("src/content/articles")).filter(file => file.endsWith(".md")).map(file => `ratgeber/${file.slice(0, -3)}`);
const pages = ["", "strom-solar", "internet", "kuehlung-kochen", "wasser-autarkie", "rechner", "ratgeber", "impressum", "datenschutz", "admin/status", "404", ...articles];
for (const page of pages) {
  const file = join(directory, page, "index.html");
  const html = await readFile(file, "utf8");
  if (!html.includes("<html") || !html.includes("<title>")) throw new Error(`Missing HTML document: ${file}`);
  if (/fonts\.(googleapis|gstatic)\.com/.test(html)) throw new Error(`Remote Google Fonts found: ${file}`);
  for (const field of ['name="description"', 'property="og:title"', 'property="og:description"', 'property="og:type"', 'name="twitter:card"']) {
    if (!html.includes(field)) throw new Error(`Missing metadata ${field}: ${file}`);
  }
  for (const match of html.matchAll(/(?:src|href)="(\/assets\/[^"?#]+)(?:[^" ]*)"/g)) await access(join(directory, match[1]));
}
for (const file of [".htaccess", "admin/index.html", "admin/config.yml", "admin/affiliate-box.js", "robots.txt", "favicon.png"]) await access(join(directory, file));
for (const file of (await readdir("src/assets")).filter(file => file.endsWith(".asset.json"))) {
  const pointer = JSON.parse(await readFile(join("src/assets", file), "utf8"));
  const bytes = await readFile(join(directory, pointer.url));
  if (bytes.length !== pointer.size) throw new Error(`Missing or incomplete localized asset: ${file}`);
}
const homepage = await readFile(join(directory, "index.html"), "utf8");
if (!homepage.includes('href="/favicon.png"')) throw new Error("Current logo favicon missing");
const assets = await readdir(join(directory, "assets"));
if (!assets.some(file => file.endsWith(".woff2"))) throw new Error("Local WOFF2 fonts missing");
const apache = await readFile(join(directory, ".htaccess"), "utf8");
if (!apache.includes("ErrorDocument 404 /404/index.html")) throw new Error("Apache 404 fallback missing");
if (/<script\b/i.test(await readFile(join(directory, "404/index.html"), "utf8"))) throw new Error("Apache error document must not hydrate at an unknown URL; run prepare-static.mjs");
console.log(`Static export verified: ${pages.length} HTML pages, admin, Apache settings and local fonts in ${directory}`);