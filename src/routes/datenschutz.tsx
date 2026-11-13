import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { openCookieSettings } from "@/components/site/CookieBanner";

export const Route = createFileRoute("/datenschutz")({
  head: () => ({
    meta: [
      { title: "Datenschutzerklärung | autarkie-camper.de" },
      { name: "description", content: "Informationen zur Verarbeitung personenbezogener Daten nach DSGVO." },
      { property: "og:title", content: "Datenschutz – autarkie-camper.de" },
      { property: "og:description", content: "Datenschutzerklärung nach DSGVO." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-12 text-muted-foreground">
      <h1 className="text-4xl font-semibold text-foreground">Datenschutzerklärung</h1>
      <p>Verantwortlicher ist der im <a href="/impressum" className="text-primary underline">Impressum</a> genannte Betreiber.</p>
      <h2 className="text-xl font-semibold text-foreground">Hosting</h2>
      <p>Diese Website wird bei der Alfahosting GmbH, Ankerstraße 3b, 06108 Halle (Saale), gehostet. Beim Aufruf werden technisch notwendige Server-Logfiles (IP-Adresse, Zeitpunkt, Browser) verarbeitet (Art. 6 Abs. 1 lit. f DSGVO).</p>
      <h2 className="text-xl font-semibold text-foreground">Google Analytics 4</h2>
      <p>Nur nach deiner ausdrücklichen Einwilligung (Art. 6 Abs. 1 lit. a DSGVO, § 25 TDDDG) laden wir Google Analytics mit IP-Anonymisierung. Du kannst deine Einwilligung jederzeit widerrufen.</p>
      <Button variant="outline" onClick={openCookieSettings}>Cookie-Einstellungen öffnen</Button>
      <h2 className="text-xl font-semibold text-foreground">Affiliate-Links</h2>
      <p>Beim Klick auf Partnerlinks (Amazon, Awin, TradeTracker, Maentum, ADCELL) wirst du zur Seite des Anbieters weitergeleitet; dort können Cookies zur Provisionszuordnung gesetzt werden.</p>
      <h2 className="text-xl font-semibold text-foreground">Schriftarten</h2>
      <p>Die Schriftarten Manrope und Fraunces werden lokal von dieser Website geladen. Beim Laden der Schriften wird keine Verbindung zu Google hergestellt.</p>
      <h2 className="text-xl font-semibold text-foreground">Aktuelle Artikel von GitHub</h2>
      <p>Für aktuelle Beiträge ruft dein Browser öffentliche Artikel von GitHub ab. Dabei erhält GitHub insbesondere deine IP-Adresse und technische Verbindungsdaten. Neu hochgeladene Artikelbilder werden gegebenenfalls von raw.githubusercontent.com geladen. Die Verarbeitung dient der Bereitstellung aktueller Inhalte (Art. 6 Abs. 1 lit. f DSGVO); hierbei werden keine GitHub-Anmeldedaten oder Analyse-Cookies verwendet. Informationen findest du in der Datenschutzerklärung von GitHub.</p>
      <h2 className="text-xl font-semibold text-foreground">Deine Rechte</h2>
      <p>Du hast das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit und Widerspruch sowie ein Beschwerderecht bei einer Aufsichtsbehörde.</p>
    </div>
  ),
});
