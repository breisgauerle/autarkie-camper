import { readFile, writeFile, rm } from "node:fs/promises";
import { resolve, join } from "node:path";

const directory = resolve(process.argv[2] ?? "dist/client");
const errorFile = join(directory, "404/index.html");
const html = await readFile(errorFile, "utf8");
// ErrorDocument keeps the originally requested URL. Hydrating the /404 route there
// would replace the error page with that unrelated URL's route. Keep this fallback
// independent of JavaScript; local CSS/fonts and the ordinary home link still work.
await writeFile(errorFile, html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ""));
await rm(join(directory, "_headers"), { force: true });
console.log("Apache export prepared: script-free 404 fallback; Worker-only headers removed.");