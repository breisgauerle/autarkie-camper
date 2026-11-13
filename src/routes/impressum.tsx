import { createFileRoute } from "@tanstack/react-router";
import { ProtectedText } from "@/components/site/ProtectedText";

const CONTACT = [[80,117,110,118,39,82,121,118,119,104,123],[83,124,112,122,108,117,122,123,121,104,230,108,39,57,56],[62,64,59,56,55,39,73,104,107,108,117,126,108,112,115,108,121],[76,52,84,104,112,115,65,39,116,104,112,115,71,105,124,128,111,108,121,108,57,59,53,106,118,116]];

export const Route = createFileRoute("/impressum")({
  head: () => ({
    meta: [
      { title: "Impressum | autarkie-camper.de" },
      { name: "description", content: "Impressum und Anbieterkennzeichnung gemäß § 5 DDG." },
      { property: "og:title", content: "Impressum – autarkie-camper.de" },
      { property: "og:description", content: "Anbieterkennzeichnung gemäß § 5 DDG." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-12">
      <h1 className="text-4xl font-semibold">Impressum</h1>
      <section><h2 className="mb-3 text-xl font-semibold">Angaben gemäß § 5 DDG</h2><ProtectedText lines={CONTACT} label="Kontaktdaten des Anbieters (als Grafik zum Schutz vor Spam)" /></section>
      <section><h2 className="mb-2 text-xl font-semibold">Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2><ProtectedText lines={CONTACT.slice(0, 3)} label="Verantwortliche Person" /></section>
      <section><h2 className="mb-2 text-xl font-semibold">Affiliate-Hinweis</h2><p className="text-muted-foreground">Diese Website enthält Affiliate-Links (u. a. Amazon Partnerprogramm, Awin, TradeTracker, ADCELL). Als Amazon-Partner verdienen wir an qualifizierten Verkäufen. Für dich entstehen keine Mehrkosten.</p></section>
      <section><h2 className="mb-2 text-xl font-semibold">Verbraucherstreitbeilegung</h2><p className="text-muted-foreground">Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p></section>
      <section><h2 className="mb-2 text-xl font-semibold">Haftung für Inhalte und Links</h2><p className="text-muted-foreground">Die Inhalte wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität können wir keine Gewähr übernehmen. Für Inhalte verlinkter externer Seiten sind ausschließlich deren Betreiber verantwortlich.</p></section>
    </div>
  ),
});
