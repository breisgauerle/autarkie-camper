import { describe, it, expect } from "vitest";
import { calculate } from "./power";

describe("Stromrechner", () => {
  it("rechnet Wh und Ah bei 12 V", () => {
    const r = calculate([{ watts: 45, hours: 8 }, { watts: 60, hours: 4 }]);
    expect(r.wh).toBe(600);
    expect(r.ah).toBe(50);
  });
  it("empfiehlt 100 Ah LiFePO4 und 200 W Solar für 600 Wh", () => {
    const r = calculate([{ watts: 600, hours: 1 }]);
    expect(r.batteryAh).toBe(100);
    expect(r.solarW).toBe(200);
  });
  it("leere Auswahl ergibt keine Empfehlung", () => {
    expect(calculate([]).batteryAh).toBe(0);
  });
});
