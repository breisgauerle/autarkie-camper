import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, ExternalLink, Github, RefreshCw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { readAdminStatus, type AdminSetting } from "@/lib/admin-status";

export const Route = createFileRoute("/admin_/status")({
  head: () => ({ meta: [
    { title: "Admin-Verbindungsstatus | autarkie-camper.de" },
    { name: "description", content: "Öffentliche CMS-Verbindungseinstellungen und offene Einrichtungsschritte für GitHub und Netlify." },
    { property: "og:title", content: "Admin-Verbindungsstatus – autarkie-camper.de" },
    { property: "og:description", content: "GitHub- und OAuth-Konfiguration ohne Zugangsdaten im Überblick." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex, nofollow" },
  ] }),
  component: AdminStatusPage,
});

function AdminStatusPage() {
  const [settings, setSettings] = useState<AdminSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [revision, setRevision] = useState(0);
  const [checkedAt, setCheckedAt] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(false);
    const timeout = window.setTimeout(() => controller.abort(), 10000);
    fetch("/admin/config.yml", { cache: "no-store", credentials: "omit", signal: controller.signal })
      .then(async response => {
        if (!response.ok) throw new Error("Configuration unavailable");
        return readAdminStatus(await response.text());
      })
      .then(values => { setSettings(values); setCheckedAt(new Date().toLocaleString("de-DE")); })
      .catch(() => { setError(true); setSettings([]); })
      .finally(() => { window.clearTimeout(timeout); setLoading(false); });
    return () => { window.clearTimeout(timeout); controller.abort(); };
  }, [revision]);

  const missing = settings.filter(s => s.status !== "configured");
  const repo = settings.find(s => s.label === "GitHub-Repository" && s.status === "configured")?.value;
  return (
    <div className="mx-auto max-w-5xl px-5 py-12 md:py-16">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-5">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase text-primary">Redaktion · autarkie-camper.de</p>
          <h1 className="text-3xl md:text-4xl">Verbindungsstatus</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" disabled={loading} onClick={() => setRevision(v => v + 1)}><RefreshCw className={loading ? "animate-spin motion-reduce:animate-none" : ""} />Aktualisieren</Button>
          <Button asChild><a href="/admin/index.html">Zur Redaktion <ExternalLink /></a></Button>
        </div>
      </div>

      <div className="mb-8 flex items-start gap-3 border-y border-border py-5 text-sm text-muted-foreground">
        <ShieldCheck className="size-5 shrink-0 text-primary" />
        <p>Nur öffentliche Einstellungen. Zugangsdaten, Tokens und Secrets werden nicht angezeigt. GitHub-Zugriff und die Einrichtung in Netlify sind hier nicht überprüfbar.</p>
      </div>

      <section aria-labelledby="config-title" aria-busy={loading}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 id="config-title" className="text-2xl">GitHub & OAuth</h2>
          <span className="text-sm text-muted-foreground" role="status">{loading ? "Einstellungen werden geladen …" : error ? "Prüfung nicht möglich" : missing.length ? `${missing.length} Einstellungen fehlen oder sind ungültig` : "6 Einstellungen hinterlegt"}</span>
        </div>
        {error ? <div role="alert" className="flex gap-3 border border-destructive p-5 text-destructive"><AlertCircle className="size-5 shrink-0" /><p>Die Admin-Konfiguration konnte nicht gelesen werden. Bitte erneut versuchen oder prüfen, ob /admin/config.yml erreichbar ist.</p></div> : <dl className="divide-y divide-border border-y border-border">
          {settings.map(setting => <div key={setting.label} className="grid gap-2 py-4 md:grid-cols-[180px_1fr_auto] md:items-center">
            <dt className="font-semibold">{setting.label}</dt>
            <dd className="min-w-0 break-all text-sm text-muted-foreground">{setting.value}</dd>
            <dd className={`flex items-center gap-2 text-sm ${setting.status === "configured" ? "text-primary" : "text-destructive"}`}>
              {setting.status === "configured" ? <CheckCircle2 className="size-4" /> : <AlertCircle className="size-4" />}
              {setting.status === "configured" ? "Hinterlegt" : setting.status === "missing" ? "Fehlt" : "Ungültig"}
            </dd>
          </div>)}
        </dl>}
        {checkedAt && !error && <p className="mt-3 text-xs text-muted-foreground">Konfiguration gelesen: {checkedAt} · „Hinterlegt“ bestätigt keine erfolgreiche Verbindung.</p>}
      </section>

      <section className="mt-10" aria-labelledby="steps-title">
        <h2 id="steps-title" className="text-2xl">Noch zu prüfen</h2>
        <p className="mt-2 text-sm text-muted-foreground">Diese Kontoeinstellungen sind nicht öffentlich einsehbar. Ihr Status bleibt ungeprüft.</p>
        <ul className="mt-5 divide-y divide-border">
          {[
            ["GitHub-Repository & Schreibzugriff", "Das Repository und der konfigurierte Branch müssen existieren; dein GitHub-Konto braucht Schreibzugriff."],
            ["GitHub OAuth App", "Callback-URL: https://api.netlify.com/auth/done"],
            ["Netlify Authentication Provider", "GitHub als OAuth-Anbieter einrichten. Client ID und Client Secret ausschließlich dort hinterlegen."],
            ["Netlify-Domainzuordnung", "Die Website-Domain muss dem Netlify-Projekt für die Anmeldung zugeordnet sein."],
            ["Vollständige Anmeldung", "In der Redaktion „Mit GitHub einloggen“ öffnen und die Anmeldung abschließen."],
          ].map(([title, detail]) => <li key={title} className="flex items-start justify-between gap-4 py-5"><div><h3 className="font-sans font-semibold">{title}</h3><p className="mt-1 break-words text-sm text-muted-foreground">{detail}</p></div><span className="shrink-0 text-xs text-muted-foreground">Ungeprüft</span></li>)}
        </ul>
        <div className="mt-5 flex flex-wrap gap-3">
          {repo && <Button asChild variant="outline"><a href={`https://github.com/${repo}`} target="_blank" rel="noopener noreferrer"><Github />Repository öffnen <ExternalLink /></a></Button>}
          <Button asChild variant="outline"><a href="https://app.netlify.com/" target="_blank" rel="noopener noreferrer">Netlify öffnen <ExternalLink /></a></Button>
        </div>
      </section>
    </div>
  );
}