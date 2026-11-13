// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// Never set ssr.external or resolve.external: the Worker has no runtime module resolution, so
// the build fails. Never add compression (compressPublicAssets, vite-plugin-compression):
// hosting already compresses at the edge.
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { readdirSync } from "node:fs";

// Enumerate article URLs on every build, including articles added through Decap.
const articlePaths = readdirSync(new URL("./src/content/articles/", import.meta.url))
  .filter(file => file.endsWith(".md"))
  .map(file => `/ratgeber/${file.slice(0, -3)}`);

export default defineConfig({
  tanstackStart: {
    spa: { enabled: true, prerender: { outputPath: "/_shell" } },
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
    pages: ["/", "/strom-solar", "/internet", "/kuehlung-kochen", "/wasser-autarkie", "/rechner", "/ratgeber", "/impressum", "/datenschutz", "/admin/status", "/404", ...articlePaths].map(path => ({ path })),
    // /admin is served by the existing public/admin/index.html, not prerendered.
    prerender: { enabled: true, autoStaticPathsDiscovery: false, crawlLinks: false },
  },
});
