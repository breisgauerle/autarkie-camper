import { readFile, writeFile, rm, readdir, mkdir } from "node:fs/promises";
import { resolve, join, extname } from "node:path";

const directory = resolve(process.argv[2] ?? "dist/client");
// Keep compiled asset URLs unchanged and materialize their paths for Apache.
// The origin is public; no credentials are needed for public site media.
const assetOrigin = process.argv[3];
// Offline fallback: LOVABLE_LOCAL_ASSET_DIR holds byte-identical copies of the
// pointer files named exactly like pointer.original_filename. It is used only
// when the public origin cannot be reached, and size/type are still validated.
const localAssetDir = process.env.LOVABLE_LOCAL_ASSET_DIR ? resolve(process.env.LOVABLE_LOCAL_ASSET_DIR) : null;
const localMimeTypes = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".gif": "image/gif", ".svg": "image/svg+xml" };

async function localAssetBytes(pointer, file) {
  if (!localAssetDir) return null;
  const name = pointer.original_filename;
  if (typeof name !== "string" || !name || name.includes("/") || name.includes("\\") || name.includes("..")) return null;
  let bytes;
  try {
    bytes = new Uint8Array(await readFile(join(localAssetDir, name)));
  } catch {
    return null;
  }
  const type = localMimeTypes[extname(name).toLowerCase()];
  if (bytes.length !== pointer.size || type !== pointer.content_type) throw new Error(`Local asset size or type mismatch: ${file}`);
  console.log(`Offline asset copy used: ${name} -> ${pointer.url}`);
  return bytes;
}

async function localizeAssets(source) {
  for (const entry of await readdir(source, { withFileTypes: true })) {
    const file = join(source, entry.name);
    if (entry.isDirectory()) await localizeAssets(file);
    else if (entry.name.endsWith(".asset.json")) {
      const pointer = JSON.parse(await readFile(file, "utf8"));
      if (!/^\/__l5e\/assets-v1\/[a-f0-9-]+\/[A-Za-z0-9_.-]+$/.test(pointer.url) || pointer.url.includes("..")) throw new Error(`Unsupported asset path in ${file}`);
      if (!assetOrigin && !localAssetDir) throw new Error("CDN assets require a public asset origin as the third argument.");
      let bytes = null;
      if (assetOrigin) {
        try {
          const response = await fetch(new URL(pointer.url, assetOrigin), { signal: AbortSignal.timeout(60000), redirect: "error" });
          if (!response.ok) throw new Error(`Asset download failed: ${response.status} (${file})`);
          bytes = new Uint8Array(await response.arrayBuffer());
          if (bytes.length !== pointer.size || response.headers.get("content-type")?.split(";")[0] !== pointer.content_type) throw new Error(`Asset size or type mismatch: ${file}`);
        } catch (error) {
          const fallback = await localAssetBytes(pointer, file);
          if (!fallback) throw error;
          bytes = fallback;
        }
      } else {
        bytes = await localAssetBytes(pointer, file);
        if (!bytes) throw new Error(`No public origin and no local asset copy: ${file}`);
      }
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
// The framework writes the client shell as one file; .htaccess serves it from
// the directory URL, so move it into place and keep it out of the root listing.
const shellFile = join(directory, "_shell.html");
const shell = await readFile(shellFile, "utf8");
if (!/<html\b/i.test(shell) || !/<script\b/i.test(shell)) throw new Error("Client shell is not a bootable HTML document: _shell.html");
await mkdir(join(directory, "_shell"), { recursive: true });
await writeFile(join(directory, "_shell", "index.html"), shell);
await rm(shellFile);
console.log("Apache article shell: _shell/index.html");
await rm(join(directory, "_headers"), { force: true });
console.log("Apache export prepared: script-free 404 fallback; Worker-only headers removed.");