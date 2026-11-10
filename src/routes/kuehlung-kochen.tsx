import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/site/CategoryPage";

export const Route = createFileRoute("/kuehlung-kochen")({
  head: () => ({
    meta: [
      { title: "Kühlung & Kochen | autarkie-camper.de" },
      { name: "description", content: "Kompressor-Kühlboxen und Kocher für autarkes Camping im Vergleich." },
      { property: "og:title", content: "Kühlung & Kochen im Vergleich" },
      { property: "og:description", content: "Kompressor-Kühlboxen und Kocher für autarkes Camping im Vergleich." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <CategoryPage slug="kuehlung-kochen" />,
});
