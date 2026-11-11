import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export function NotFoundPage() {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-4 py-16 text-center">
      <p className="font-display text-7xl font-semibold text-primary">404</p>
      <h1 className="mt-4 text-3xl font-semibold">Seite nicht gefunden</h1>
      <p className="mt-3 text-muted-foreground">Diese Seite existiert nicht oder wurde verschoben.</p>
      <Button asChild className="mt-6"><Link to="/">Zur Startseite</Link></Button>
    </section>
  );
}