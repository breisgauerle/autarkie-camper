import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

// Vitest runs from the project root, so these paths resolve there.
const config = readFileSync("vite.config.ts", "utf8");
const apache = readFileSync("public/.htaccess", "utf8");
const prepare = readFileSync("scripts/prepare-static.mjs", "utf8");

describe("Static export article shell", () => {
  it("masks the client shell behind a path that is not a listed page", () => {
    const spa = config.match(/spa: \{([^}]*)\}/)?.[1] ?? "";
    expect(spa).toContain("enabled: true");
    const maskPath = spa.match(/maskPath: "([^"]+)"/)?.[1];
    expect(maskPath).toBe("/ratgeber/__shell");
    // The prerender queue skips a path it has already seen, so a mask path that is
    // also a listed page would silently produce no shell document at all.
    expect(config.split(`"${maskPath}"`).length - 1).toBe(1);
    expect(spa).toContain('outputPath: "/_shell"');
  });

  it("serves new article URLs from the shell and keeps the shell file in place", () => {
    expect(apache).toContain("RewriteRule ^ratgeber/[^/.]+/?$ _shell/index.html [L]");
    expect(prepare).toContain('join(directory, "_shell.html")');
    expect(prepare).toContain('join(directory, "_shell", "index.html")');
  });
});
