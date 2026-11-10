import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/site/CategoryPage";

export const Route = createFileRoute("/wasser-autarkie")({
  head: () => ({
    meta: [
      { title: "Wasser & Autarkie | autarkie-camper.de" },
      { name: "description", content: "Wasserfilter, Tanks und Trenntoiletten für lange autarke Standzeiten." },
      { property: "og:title", content: "Wasser & Autarkie im Vergleich" },
      { property: "og:description", content: "Wasserfilter, Tanks und Trenntoiletten für lange autarke Standzeiten." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <CategoryPage slug="wasser-autarkie" />,
});
