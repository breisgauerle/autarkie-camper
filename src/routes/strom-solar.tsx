import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/site/CategoryPage";

export const Route = createFileRoute("/strom-solar")({
  head: () => ({
    meta: [
      { title: "Strom & Solar | autarkie-camper.de" },
      { name: "description", content: "Powerstationen, LiFePO4-Batterien und Solarpanels für Camper im Vergleich." },
      { property: "og:title", content: "Strom & Solar im Vergleich" },
      { property: "og:description", content: "Powerstationen, LiFePO4-Batterien und Solarpanels für Camper im Vergleich." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <CategoryPage slug="strom-solar" />,
});
