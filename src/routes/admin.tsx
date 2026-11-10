import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin | autarkie-camper.de" }, { name: "robots", content: "noindex" }] }),
  component: () => {
    useEffect(() => { window.location.replace("/admin/index.html"); }, []);
    return <p className="p-12 text-center">Admin wird geladen …</p>;
  },
});
