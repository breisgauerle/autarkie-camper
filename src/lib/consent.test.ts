import { beforeEach, describe, expect, it } from "vitest";
import { loadGA, setConsent } from "./consent";
describe("Analytics opt-in", () => {
  beforeEach(() => { localStorage.clear(); document.getElementById("ga4")?.remove(); });
  it("never loads analytics before explicit consent", () => {
    loadGA("G-TEST123");
    expect(document.getElementById("ga4")).toBeNull();
  });
  it("never loads analytics when declined", () => {
    setConsent("denied"); loadGA("G-TEST123");
    expect(document.getElementById("ga4")).toBeNull();
  });
  it("loads the configured analytics only after consent", () => {
    setConsent("granted"); loadGA("G-TEST123");
    expect(document.getElementById("ga4")?.getAttribute("src")).toBe("https://www.googletagmanager.com/gtag/js?id=G-TEST123");
  });
});