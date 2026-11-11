import { readdir, readFile, access } from "node:fs/promises";
import { join, resolve } from "node:path";

const directory = resolve(process.argv[2] ?? "dist/client");
const articles = (await readdir("src/content/articles")).filter(file => file.endsWith(".md")).map(file => `ratgeber/${file.slice(0, -3)}`);
const pages = ["", "strom-solar", "internet", "kuehlung-kochen", "wasser-autarkie", "rechner", "ratgeber", "impressum", "datenschutz", "admin/status", ...articles];
for (const page of pages) {
  const file = join(directory, page, "index.html");
  const html = await readFile(file, "utf8");
  if (!html.includes("<html") || !html.includes("<title>")) throw new Error(`Missing HTML document: ${file}`);
  if (/fonts\.(googleapis|gstatic)\.com/.test(html)) throw new Error(`Remote Google Fonts found: ${file}`);
  for (const match of html.matchAll(/(?:src|href)="(\/assets\/[^"?#]+)(?:[^" ]*)"/g)) await access(join(directory, match[1]));
}
for (const file of [".htaccess", "admin/index.html", "admin/config.yml", "robots.txt", "favicon.ico"]) await access(join(directory, file));
const assets = await readdir(join(directory, "assets"));
if (!assets.some(file => file.endsWith(".woff2"))) throw new Error("Local WOFF2 fonts missing");
console.log(`Static export verified: ${pages.length} HTML pages, admin, Apache settings and local fonts in ${directory}`);