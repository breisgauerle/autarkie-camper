# Autarkie Camper

Erstelle eine moderne, responsive und extrem schnelle Web-Anwendung / Nischen-Vergleichsseite für "Smart Travel & autarke Camping-Ausstattung" auf der Domain "autarkie-camper.de".



### 1. Design & Branding

- Clean, vertrauenerweckend und outdoor-orientiert.

- Farbpalette: Naturgrün (Forest Green), Schiefergrau (Slate/Dark Grey), Off-White / Sand.

- Hauptnavigation: 

  1. Strom & Solar

  2. Internet & Connectivity

  3. Kühlung & Kochen

  4. Wasser & Autarkie

  5. Rechner & Tools

  6. Testberichte & Ratgeber



### 2. Visuelles Content-Management-System (Decap CMS / Git-based CMS)

- Integriere eine dateibasierte Administration (Decap CMS / Git-CMS unter `/admin`).

- Bereite Eingabemasken für den Admin-Bereich vor, damit ohne Programmierkenntnisse neue Inhalte veröffentlicht werden können:

  - Formular für neue Blogartikel & Testberichte (Titel, Kategorie, Hauptbild, Markdown/WYSIWYG-Text, SEO-Meta-Daten).

  - Formular für Vergleichstabellen (Produktname, Spezifikationen, Vorteile, Nachteile, Affiliate-Links für Fachhändler & Amazon).

- Binde ein einfaches Medien-Upload-Feld für Bilder ein.



### 3. Interaktives Feature: Autarkie- & Strom-Rechner

Integriere unter der Rubrik "Rechner & Tools" ein interaktives Widget ("Der Camping-Stromrechner"):

- Der Nutzer wählt Verbraucher aus (z. B. Kühlbox, Dieselheizung, Laptop, Licht, TV) und gibt die Laufzeit in Stunden ein.

- Das Tool berechnet automatisch den Tagesverbrauch in Wattstunden (Wh) und Ampere-Stunden (Ah bei 12V).

- Das Tool spuckt als Ergebnis eine Empfehlung aus (z. B. "Du benötigst mindestens eine 100 Ah LiFePO4 Batterie und ein 200W Solarpanel").

- Platziere direkt unter dem Ergebnis dynamische Produkt-Kacheln mit Affiliate-Buttons ("Passende Powerstationen anzeigen").



### 4. Setup-Wizard & Rechtliches (DSGVO / Alfahosting)

- Onboarding-Wizard im Admin-Bereich zur Eingabe von:

  1. Google Analytics Measurement ID (GA4) + DSGVO-Opt-In-Cookie-Banner.

  2. Affiliate-Netzwerk-IDs (Awin, TradeTracker, Maentum, ADCELL, Amazon Partnernet).

- Die Seite wird bei "Alfahosting" gehostet. Optimiere den Code für blitzschnelle Ladezeiten (HTML/JS-Export-fähig).

- Erstelle eine rechtssichere Impressums-Seite (§ 5 DDG).

- WICHTIG SCHUTZ VOR SPAM-BOTS: Die Kontaktdaten im Impressum dürfen nicht als lesbarer Text im Quellcode stehen! Rendere sie dynamisch über ein HTML5 Canvas / SVG-Element.



### 5. Einzupflegende Stammdaten für das Impressum:

- Name: Ingo Kropat

- Straße & Hausnummer: Luisenstraße 21

- PLZ & Ort: 79410 Badenweiler

- E-Mail: mail@autarkie-camper.de

This project was built with [Lovable](https://lovable.dev).

## Lokale Schriften und Produktangebote

Manrope und Fraunces werden über lokal installierte Fontsource-Pakete eingebunden; es gibt keine Google-Fonts-Anfragen mehr. Dies beseitigt die externe Schriftübertragung, ist aber keine Garantie für die DSGVO-Konformität der gesamten Website.

In der Redaktion unter **Vergleichstabellen (Produkte) → Händlerangebote** können bis zu drei Angebote mit eigener Button-Beschriftung und vollständigem HTTPS-Affiliate-Link gepflegt werden. Die Vorlage `templates/produkt.json` enthält Platzhalter für Shop A, Shop B und Amazon; diese müssen durch echte Produktdaten und Links ersetzt werden. Die Vorlage wird nicht als Produkt veröffentlicht. Bei den neuen Amazon-Angeboten den vollständigen Link mit Tracking-ID eintragen. Bestehende Produkte nutzen weiterhin ihre bisherigen Händlerfelder und die automatische Amazon-Tracking-ID, solange keine neue Angebotsliste gespeichert wurde.

## Statischer HTML-Export für Alfahosting

```sh
bun install
bun run build
node scripts/verify-static.mjs dist/client
```

Der Build rendert alle öffentlichen Seiten, alle Markdown-Artikel und die Admin-Statusseite vorab als HTML. `/admin/index.html` bleibt das vorhandene Decap CMS. Es ist kein Node-Server bei Alfahosting erforderlich; Rechner, Cookie-Einstellungen und GitHub-Prüfung laufen im Browser.

Nach erfolgreicher Prüfung den **Inhalt von `dist/client/`**, einschließlich der versteckten `.htaccess`, unverändert in das Dokumentenverzeichnis der Domain bei Alfahosting hochladen. Nicht `dist/server`, Quellcode, `.env` oder `node_modules` hochladen. Die Ordner `assets`, `admin`, `uploads` (falls vorhanden) und alle Seitenordner müssen erhalten bleiben. Die Konfiguration setzt ein Apache-Webhosting mit erlaubter `.htaccess`-Nutzung und eine Domaininstallation im Stammverzeichnis voraus. HTTPS bei Alfahosting aktivieren.

Nach dem Upload Startseite, `/strom-solar`, `/rechner`, einen Artikel, `/impressum`, `/admin/` und `/admin/status` direkt aufrufen und neu laden. Die GitHub-Anmeldung funktioniert nur nach vollständiger OAuth-Einrichtung in GitHub/Netlify. Änderungen in Decap ändern Repository-Dateien; für Alfahosting ist danach immer ein neuer Build und Upload erforderlich.

Vor Veröffentlichung die bereits vorhandenen Beispiel-Händlerlinks, ASINs und Produktangaben prüfen und ersetzen. Impressum, Datenschutz, Affiliate-Kennzeichnung und Analytics-Einwilligung rechtlich prüfen lassen. Ein fertiges Upload-Archiv ist erst nach erfolgreichem statischen Build möglich.

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/8ef9999b-ffc2-4343-b9ac-1f965e25c968).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
