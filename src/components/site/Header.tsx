import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Mountain } from "lucide-react";

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
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-semibold">
          <Mountain className="size-6 text-primary-glow" /> autarkie-camper<span className="text-primary-glow">.de</span>
        </Link>
        <nav className="hidden gap-1 xl:flex">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} className="rounded-md px-3 py-2 text-sm hover:bg-sidebar-accent" activeProps={{ className: "bg-sidebar-accent text-primary-glow" }}>
              {n.label}
            </Link>
          ))}
        </nav>
        <button className="xl:hidden" aria-label="Menü" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
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
