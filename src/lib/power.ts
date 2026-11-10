export type Consumer = { id: string; name: string; watts: number; defaultHours: number };

export const CONSUMERS: Consumer[] = [
  { id: "kuehlbox", name: "Kompressor-Kühlbox", watts: 45, defaultHours: 8 },
  { id: "heizung", name: "Dieselheizung", watts: 25, defaultHours: 6 },
  { id: "laptop", name: "Laptop", watts: 60, defaultHours: 4 },
  { id: "licht", name: "LED-Licht", watts: 10, defaultHours: 5 },
  { id: "tv", name: "TV (12 V)", watts: 40, defaultHours: 2 },
  { id: "starlink", name: "Starlink Mini", watts: 30, defaultHours: 6 },
  { id: "handy", name: "Smartphone laden", watts: 15, defaultHours: 2 },
  { id: "pumpe", name: "Wasserpumpe", watts: 50, defaultHours: 0.3 },
];

export const BATTERY_SIZES = [50, 100, 150, 200, 280, 300, 400, 600];
export const SOLAR_SIZES = [100, 150, 200, 300, 400, 600, 800, 1000];
const VOLTAGE = 12;
const LIFEPO4_USABLE = 0.9;
const RESERVE = 1.2;
const PEAK_SUN_HOURS = 4;
const SOLAR_EFFICIENCY = 0.75;

export function calculate(items: { watts: number; hours: number }[]) {
  const wh = items.reduce((s, i) => s + Math.max(0, i.watts) * Math.max(0, i.hours), 0);
  const ah = wh / VOLTAGE;
  const neededAh = (ah * RESERVE) / LIFEPO4_USABLE;
  const neededSolar = wh / (PEAK_SUN_HOURS * SOLAR_EFFICIENCY);
  const pick = (list: number[], v: number) => list.find((x) => x >= v) ?? list[list.length - 1];
  return {
    wh: Math.round(wh),
    ah: Math.round(ah * 10) / 10,
    batteryAh: wh === 0 ? 0 : pick(BATTERY_SIZES, neededAh),
    solarW: wh === 0 ? 0 : pick(SOLAR_SIZES, neededSolar),
  };
}
