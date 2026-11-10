import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { getConsent, setConsent, loadGA } from "@/lib/consent";
import { settings } from "@/lib/content";

export function openCookieSettings() { window.dispatchEvent(new Event("ac-open-cookies")); }

export function CookieBanner() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const c = getConsent();
    if (c === "granted") loadGA(settings.ga4_id);
    if (!c && settings.ga4_id) setShow(true);
    const open = () => setShow(true);
    window.addEventListener("ac-open-cookies", open);
    return () => window.removeEventListener("ac-open-cookies", open);
  }, []);
  if (!show) return null;
  const choose = (v: "granted" | "denied") => { setConsent(v); if (v === "granted") loadGA(settings.ga4_id); else if (getConsent()) location.reload(); setShow(false); };
  return (
    <div role="dialog" aria-label="Cookie-Einstellungen" className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-xl rounded-xl border bg-card p-5 shadow-card">
      <p className="font-semibold">Wir respektieren deine Privatsphäre</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Mit deiner Einwilligung nutzen wir Google Analytics (GA4, IP-anonymisiert), um die Seite zu verbessern. Ohne Zustimmung werden keine Analyse-Cookies gesetzt. <Link to="/datenschutz" className="underline">Mehr erfahren</Link>
      </p>
      <div className="mt-4 flex gap-2">
        <Button variant="outline" className="flex-1" onClick={() => choose("denied")}>Nur notwendige</Button>
        <Button className="flex-1" onClick={() => choose("granted")}>Akzeptieren</Button>
      </div>
    </div>
  );
}
