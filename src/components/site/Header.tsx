import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import logo from "@/assets/logo-autarkie-camper.png.asset.json";
import { Button } from "@/components/ui/button";

const NAV = [
  { to: "/strom-solar", label: "Strom & Solar" },
  { to: "/internet", label: "Internet & Connectivity" },
  { to: "/kuehlung-kochen", label: "Kühlung & Kochen" },
  { to: "/wasser-autarkie", label: "Wasser & Autarkie" },
  { to: "/rechner", label: "Rechner & Tools" },
  { to: "/ratgeber", label: "Testberichte & Ratgeber" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-sidebar-border bg-secondary text-secondary-foreground">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" aria-label="autarkie-camper.de – Startseite" className="flex min-w-0 shrink-0 items-center gap-3 font-display text-base font-semibold sm:text-lg">
          <img src={logo.url} alt="" width={64} height={64} className="size-14 shrink-0 object-contain sm:size-16" fetchPriority="high" /><span>autarkie-camper<span className="text-primary-glow">.de</span></span>
        </Link>
        <nav className="hidden gap-1 xl:flex">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} className="rounded-md px-3 py-2 text-sm hover:bg-sidebar-accent" activeProps={{ className: "bg-sidebar-accent text-primary-glow" }}>
              {n.label}
            </Link>
          ))}
        </nav>
        <Button variant="ghost" size="icon" className="shrink-0 hover:bg-sidebar-accent hover:text-secondary-foreground xl:hidden" aria-label="Menü" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</Button>
      </div>
      {open && (
        <nav className="flex flex-col border-t border-sidebar-border px-4 py-2 xl:hidden">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="py-3 text-sm">{n.label}</Link>
          ))}
        </nav>
      )}
    </header>
  );
}
