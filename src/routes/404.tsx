import { createFileRoute } from "@tanstack/react-router";
import { NotFoundPage } from "@/components/site/NotFoundPage";

export const Route = createFileRoute("/404")({
  head: () => ({ meta: [
    { title: "Seite nicht gefunden | autarkie-camper.de" },
    { name: "description", content: "Die gesuchte Seite auf autarkie-camper.de wurde nicht gefunden." },
    { property: "og:title", content: "Seite nicht gefunden | autarkie-camper.de" },
    { property: "og:description", content: "Zurück zu Vergleichen, Ratgebern und Camping-Rechnern." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex, nofollow" },
  ] }),
  component: NotFoundPage,
});