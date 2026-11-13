import { useEffect, useRef } from "react";

// Lines are stored as shifted char codes and drawn on a canvas, so no readable contact data is in the HTML.
const decode = (codes: number[]) => String.fromCharCode(...codes.map((c) => c - 7));
export const encode = (s: string) => [...s].map((c) => c.charCodeAt(0) + 7);

export function ProtectedText({ lines, label }: { lines: number[][]; label: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const dpr = window.devicePixelRatio || 1;
    const css = getComputedStyle(c);
    const font = `16px ${css.fontFamily}`;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.font = font;
    const text = lines.map(decode);
    const w = Math.ceil(Math.max(...text.map((t) => ctx.measureText(t).width))) + 4;
    const h = text.length * 26;
    c.width = w * dpr; c.height = h * dpr; c.style.width = `${w}px`; c.style.height = `${h}px`;
    ctx.scale(dpr, dpr); ctx.font = font; ctx.fillStyle = css.color; ctx.textBaseline = "top";
    text.forEach((t, i) => ctx.fillText(t, 0, i * 26 + 4));
  }, [lines]);
  return <canvas ref={ref} role="img" aria-label={label} className="block max-w-full text-foreground" />;
}
