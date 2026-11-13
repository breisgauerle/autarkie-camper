import { readFile, writeFile, rm, readdir, mkdir } from "node:fs/promises";
import { resolve, join } from "node:path";

const directory = resolve(process.argv[2] ?? "dist/client");
// Keep compiled asset URLs unchanged and materialize their paths for Apache.
// The origin is public; no credentials are needed for public site media.
const assetOrigin = process.argv[3];
async function localizeAssets(source) {
  for (const entry of await readdir(source, { withFileTypes: true })) {
    const file = join(source, entry.name);
    if (entry.isDirectory()) await localizeAssets(file);
    else if (entry.name.endsWith(".asset.json")) {
      const pointer = JSON.parse(await readFile(file, "utf8"));
      if (!/^\/__l5e\/assets-v1\/[a-f0-9-]+\/[A-Za-z0-9_.-]+$/.test(pointer.url) || pointer.url.includes("..")) throw new Error(`Unsupported asset path in ${file}`);
      if (!assetOrigin) throw new Error("CDN assets require a public asset origin as the third argument.");
      const response = await fetch(new URL(pointer.url, assetOrigin), { signal: AbortSignal.timeout(60000), redirect: "error" });
      if (!response.ok) throw new Error(`Asset download failed: ${response.status} (${file})`);
      const bytes = new Uint8Array(await response.arrayBuffer());
      if (bytes.length !== pointer.size || response.headers.get("content-type")?.split(";")[0] !== pointer.content_type) throw new Error(`Asset size or type mismatch: ${file}`);
      const destination = join(directory, pointer.url);
      await mkdir(resolve(destination, ".."), { recursive: true });
      await writeFile(destination, bytes);
      console.log(`Local Apache asset: ${pointer.url}`);
    }
  }
}
await localizeAssets(resolve("src/assets"));
const errorFile = join(directory, "404/index.html");
const html = await readFile(errorFile, "utf8");
// ErrorDocument keeps the originally requested URL. Hydrating the /404 route there
// would replace the error page with that unrelated URL's route. Keep this fallback
// independent of JavaScript; local CSS/fonts and the ordinary home link still work.
await writeFile(errorFile, html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ""));
await rm(join(directory, "_headers"), { force: true });
console.log("Apache export prepared: script-free 404 fallback; Worker-only headers removed.");