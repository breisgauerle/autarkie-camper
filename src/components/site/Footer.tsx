import { Link } from "@tanstack/react-router";
import { openCookieSettings } from "./CookieBanner";

export function Footer() {
  return (
    <footer className="mt-20 bg-secondary text-secondary-foreground">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-10 text-sm md:flex-row md:justify-between">
        <p className="opacity-80">© {new Date().getFullYear()} autarkie-camper.de · *Affiliate-Links: Wir erhalten ggf. eine Provision, für dich ändert sich der Preis nicht.</p>
        <div className="flex gap-4">
          <Link to="/impressum">Impressum</Link>
          <Link to="/datenschutz">Datenschutz</Link>
          <button onClick={openCookieSettings} className="underline-offset-4 hover:underline">Cookie-Einstellungen</button>
        </div>
      </div>
    </footer>
  );
}
