import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/site/CategoryPage";

export const Route = createFileRoute("/internet")({
  head: () => ({
    meta: [
      { title: "Internet & Connectivity | autarkie-camper.de" },
      { name: "description", content: "Starlink, LTE- und 5G-Router für Camper im Vergleich." },
      { property: "og:title", content: "Internet & Connectivity im Vergleich" },
      { property: "og:description", content: "Starlink, LTE- und 5G-Router für Camper im Vergleich." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <CategoryPage slug="internet" />,
});
