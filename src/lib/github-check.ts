export type CheckState = "verified" | "denied" | "unknown";
export type GitHubCheckResult = {
  connection: CheckState;
  repository: CheckState;
  writeAccess: CheckState;
  branch: CheckState;
  message: string;
};

const initial: GitHubCheckResult = {
  connection: "unknown", repository: "unknown", writeAccess: "unknown", branch: "unknown", message: "",
};

function object(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

// Credentials stay in this function's scope and only go to GitHub in a header.
// Never return/log raw responses, storage, tokens or caught exceptions.
export async function checkGitHubAccess(
  repo: string,
  branch: string,
  storage: Pick<Storage, "getItem">,
  request: typeof fetch = fetch,
): Promise<GitHubCheckResult> {
  const result = { ...initial };
  if (!/^[a-zA-Z0-9-]+\/[a-zA-Z0-9_.-]+$/.test(repo) || !/^[a-zA-Z0-9_./-]{1,100}$/.test(branch)) {
    return { ...result, message: "Repository oder Branch sind nicht gültig konfiguriert." };
  }
  let token: unknown;
  try {
    const saved = object(JSON.parse(storage.getItem("decap-cms-user") ?? "null"));
    if (saved["backendName"] === "github") token = saved["token"];
  } catch {
    return { ...result, message: "Die Admin-Anmeldung konnte nicht gelesen werden. Bitte erneut in der Redaktion anmelden." };
  }
  if (typeof token !== "string" || !token || /[\s\r\n]/.test(token)) {
    return { ...result, message: "Bitte zuerst in der Redaktion mit GitHub anmelden und anschließend hier erneut prüfen." };
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  const get = (path: string) => request(`https://api.github.com${path}`, {
    method: "GET", headers: { Accept: "application/vnd.github+json", Authorization: `Bearer ${token}` },
    credentials: "omit", cache: "no-store", redirect: "error", referrerPolicy: "no-referrer", signal: controller.signal,
  });
  const failure = (response: Response, target: "connection" | "repository" | "branch") => {
    if (response.status === 401) {
      result.connection = "denied";
      result.message = "Die GitHub-Anmeldung ist ungültig oder abgelaufen. Bitte in der Redaktion erneut anmelden.";
    } else if (response.status === 429 || response.headers.get("x-ratelimit-remaining") === "0" || response.headers.has("retry-after")) {
      result.message = "GitHub begrenzt derzeit die Anfragen. Bitte später erneut prüfen.";
    } else if (response.status === 404) {
      result.message = target === "branch" ? "Der konfigurierte Branch wurde nicht gefunden oder ist nicht zugänglich." : "Das Repository wurde nicht gefunden oder ist mit dieser Anmeldung nicht zugänglich.";
    } else if (response.status === 403) {
      result.message = "GitHub verweigert diese Anfrage. Bitte Berechtigungen oder Organisationsfreigaben in GitHub prüfen.";
    } else {
      result.message = `GitHub konnte die Prüfung nicht abschließen (HTTP ${response.status}). Bitte später erneut versuchen.`;
    }
    return result;
  };
  try {
    const user = await get("/user");
    if (!user.ok) return failure(user, "connection");
    result.connection = "verified";
    const repository = await get(`/repos/${repo}`);
    if (!repository.ok) return failure(repository, "repository");
    const data = object(await repository.json());
    result.repository = "verified";
    const push = object(data["permissions"])["push"];
    result.writeAccess = push === true ? "verified" : push === false ? "denied" : "unknown";
    const branchResponse = await get(`/repos/${repo}/branches/${encodeURIComponent(branch)}`);
    if (!branchResponse.ok) return failure(branchResponse, "branch");
    result.branch = "verified";
    result.message = push === true
      ? "GitHub-Anmeldung, Repository-Zugriff, Schreibberechtigung und Branch bestätigt. Es wurden keine Inhalte verändert. Branch-Schutzregeln bleiben ungeprüft."
      : push === false
        ? "GitHub-Anmeldung, Repository und Branch bestätigt. GitHub meldet keine Schreibberechtigung für dieses Konto."
        : "GitHub-Anmeldung, Repository und Branch bestätigt. GitHub liefert keine eindeutige Schreibberechtigung zurück.";
    return result;
  } catch {
    return { ...result, message: "Die Prüfung wurde unterbrochen oder GitHub ist nicht erreichbar. Bitte erneut versuchen." };
  } finally {
    clearTimeout(timeout);
  }
}