import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [
    { title: "Redaktion | autarkie-camper.de" },
    { name: "description", content: "Redaktionsbereich für Artikel, Vergleiche und Website-Einstellungen von autarkie-camper.de." },
    { property: "og:title", content: "Redaktion – autarkie-camper.de" },
    { property: "og:description", content: "Inhalte und Einstellungen von autarkie-camper.de verwalten." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex" },
  ] }),
  component: () => {
    useEffect(() => { window.location.replace("/admin/index.html"); }, []);
    return <p className="p-12 text-center">Admin wird geladen …</p>;
  },
});
