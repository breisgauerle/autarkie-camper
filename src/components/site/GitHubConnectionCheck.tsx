import { useState } from "react";
import { Github, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { checkGitHubAccess, type GitHubCheckResult } from "@/lib/github-check";

export function GitHubConnectionCheck({ repo, branch }: { repo: string | undefined; branch: string | undefined }) {
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<GitHubCheckResult>();
  const [checkedAt, setCheckedAt] = useState("");

  const check = async () => {
    if (!repo || !branch || checking) return;
    setChecking(true);
    setResult(undefined);
    try {
      setResult(await checkGitHubAccess(repo, branch, window.localStorage));
      setCheckedAt(new Date().toLocaleString("de-DE"));
    } catch {
      setResult({ connection: "unknown", repository: "unknown", writeAccess: "unknown", branch: "unknown", message: "Die Admin-Anmeldung ist nicht zugänglich. Bitte Browsereinstellungen prüfen und erneut anmelden." });
    } finally {
      setChecking(false);
    }
  };
  return <section className="mt-10 border-y border-border py-6" aria-labelledby="github-check-title" aria-busy={checking}>
    <div className="flex flex-wrap items-center justify-between gap-4">
      <h2 id="github-check-title" className="text-2xl">GitHub-Zugriff prüfen</h2>
      <Button disabled={checking || !repo || !branch} onClick={check}>
        {checking ? <LoaderCircle className="animate-spin motion-reduce:animate-none" /> : <Github />}
        {checking ? "Wird geprüft …" : "GitHub-Verbindung prüfen"}
      </Button>
    </div>
    <p className="mt-3 text-sm text-muted-foreground">Die bestehende GitHub-Anmeldung der Redaktion wird verwendet. Die Prüfung liest ausschließlich; Zugangsdaten werden weder angezeigt noch an andere Dienste weitergegeben.</p>
    {(!repo || !branch) && <p className="mt-3 text-sm text-destructive">Bitte zuerst ein gültiges Repository und einen Branch hinterlegen.</p>}
    <div aria-live="polite" className="mt-4">
      {result && <>
        <p className="text-sm">{result.message}</p>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {([
            ["GitHub-Anmeldung", result.connection], ["Repository-Zugriff", result.repository],
            ["Schreibberechtigung", result.writeAccess], ["Branch", result.branch],
          ] as const).map(([label, state]) => <div key={label}><dt className="text-sm font-semibold">{label}</dt><dd className={`mt-1 text-sm ${state === "verified" ? "text-primary" : state === "denied" ? "text-destructive" : "text-muted-foreground"}`}>{state === "verified" ? "Bestätigt" : state === "denied" ? "Nicht berechtigt" : "Nicht bestätigt"}</dd></div>)}
        </dl>
        {checkedAt && <p className="mt-4 text-xs text-muted-foreground">Geprüft: {checkedAt} · {repo} · {branch}</p>}
        {result.connection !== "verified" && <Button asChild variant="link" className="mt-3 px-0"><a href="/admin/index.html">In der Redaktion anmelden</a></Button>}
      </>}
    </div>
  </section>;
}