import { describe, expect, it, vi } from "vitest";
import { checkGitHubAccess } from "./github-check";

const repo = "breisgauerle/autarkie-camper";
const storage = { getItem: () => JSON.stringify({ backendName: "github", token: "TEST_ONLY_TOKEN" }) };
const response = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status });

describe("GitHub access check", () => {
  it("requires the existing GitHub admin session without making unauthenticated requests", async () => {
    const request = vi.fn();
    const result = await checkGitHubAccess(repo, "main", { getItem: () => null }, request);
    expect(result.connection).toBe("unknown");
    expect(request).not.toHaveBeenCalled();
  });
  it("checks account, repository permissions and main branch using only GET without exposing credentials", async () => {
    const request = vi.fn().mockResolvedValueOnce(response({})).mockResolvedValueOnce(response({ permissions: { push: true }, token: "PRIVATE_RESPONSE" })).mockResolvedValueOnce(response({}));
    const result = await checkGitHubAccess(repo, "main", storage, request);
    expect(result).toMatchObject({ connection: "verified", repository: "verified", writeAccess: "verified", branch: "verified" });
    expect(request.mock.calls.map(call => call[0])).toEqual(["https://api.github.com/user", `https://api.github.com/repos/${repo}`, `https://api.github.com/repos/${repo}/branches/main`]);
    for (const [, options] of request.mock.calls) {
      expect(options.method).toBe("GET");
      expect(options.redirect).toBe("error");
      expect(options.headers.Authorization).toBe("Bearer TEST_ONLY_TOKEN");
    }
    expect(JSON.stringify(result)).not.toContain("TEST_ONLY_TOKEN");
    expect(JSON.stringify(result)).not.toContain("PRIVATE_RESPONSE");
  });
  it("does not claim write access when GitHub denies it", async () => {
    const request = vi.fn().mockResolvedValueOnce(response({})).mockResolvedValueOnce(response({ permissions: { push: false } })).mockResolvedValueOnce(response({}));
    expect((await checkGitHubAccess(repo, "main", storage, request)).writeAccess).toBe("denied");
  });
  it("does not treat private repository 404 as proof that the repository does not exist", async () => {
    const request = vi.fn().mockResolvedValueOnce(response({})).mockResolvedValueOnce(response({ message: "PRIVATE" }, 404));
    const result = await checkGitHubAccess(repo, "main", storage, request);
    expect(result.connection).toBe("verified");
    expect(result.repository).toBe("unknown");
    expect(JSON.stringify(result)).not.toContain("PRIVATE");
  });
  it("stops on expired credentials without retrying", async () => {
    const request = vi.fn().mockResolvedValue(response({}, 401));
    expect((await checkGitHubAccess(repo, "main", storage, request)).connection).toBe("denied");
    expect(request).toHaveBeenCalledTimes(1);
  });
  it("does not send credentials to an invalid repository URL", async () => {
    const request = vi.fn();
    await checkGitHubAccess("https://example.com", "main", storage, request);
    expect(request).not.toHaveBeenCalled();
  });
});