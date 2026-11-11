import { describe, expect, it } from "vitest";
import { readAdminStatus } from "./admin-status";

describe("Admin status privacy and connection settings", () => {
  it("only returns public connection fields, never access credentials", () => {
    const result = readAdminStatus('backend:\n  name: github\n  repo: breisgauerle/autarkie-camper\n  client_secret: PRIVATE_SECRET\n  access_token: PRIVATE_TOKEN\n');
    expect(result.find(s => s.label === "GitHub-Repository")?.value).toBe("breisgauerle/autarkie-camper");
    expect(JSON.stringify(result)).not.toContain("PRIVATE_SECRET");
    expect(JSON.stringify(result)).not.toContain("PRIVATE_TOKEN");
    expect(result).toHaveLength(6);
  });
  it("marks absent OAuth settings as missing", () => {
    expect(readAdminStatus("backend: {name: github}").find(s => s.label === "OAuth-Anbieter")?.status).toBe("missing");
  });
  it("hides credentials embedded in provider URLs", () => {
    const result = readAdminStatus('backend:\n  base_url: https://user:PRIVATE_SECRET@api.netlify.com?token=PRIVATE_TOKEN');
    expect(result.find(s => s.label === "OAuth-Anbieter")?.status).toBe("invalid");
    expect(JSON.stringify(result)).not.toContain("PRIVATE_SECRET");
    expect(JSON.stringify(result)).not.toContain("PRIVATE_TOKEN");
  });
});