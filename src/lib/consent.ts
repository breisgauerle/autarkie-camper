const KEY = "ac-consent";
export type Consent = "granted" | "denied";
export const getConsent = (): Consent | null => (typeof localStorage === "undefined" ? null : (localStorage.getItem(KEY) as Consent | null));
export function setConsent(v: Consent) { localStorage.setItem(KEY, v); window.dispatchEvent(new Event("ac-consent")); }
export function loadGA(id: string) {
  if (getConsent() !== "granted" || !/^G-[A-Z0-9]+$/.test(id) || document.getElementById("ga4")) return;
  const s = document.createElement("script");
  s.id = "ga4"; s.async = true; s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(s);
  const w = window as unknown as { dataLayer: unknown[]; gtag: (...a: unknown[]) => void };
  w.dataLayer = w.dataLayer || [];
  w.gtag = function () { w.dataLayer.push(arguments); };
  w.gtag("js", new Date());
  w.gtag("config", id, { anonymize_ip: true });
}
