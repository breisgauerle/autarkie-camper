import { parse } from "yaml";

export type SettingStatus = "configured" | "missing" | "invalid";
export type AdminSetting = { label: string; value: string; status: SettingStatus };

function record(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown> : {};
}

// Only these public fields may leave the parser; never return raw config or errors.
export function readAdminStatus(source: string): AdminSetting[] {
  const backend = record(record(parse(source))["backend"]);
  const field = (label: string, key: string, valid: (value: string) => boolean): AdminSetting => {
    const value = backend[key];
    if (value === undefined || value === null || value === "") return { label, value: "Nicht hinterlegt", status: "missing" };
    if (typeof value !== "string" || !valid(value)) return { label, value: "Ungültige Einstellung (Wert ausgeblendet)", status: "invalid" };
    return { label, value, status: "configured" };
  };
  return [
    field("CMS-Anbindung", "name", v => v === "github"),
    field("GitHub-Repository", "repo", v => /^[a-zA-Z0-9-]+\/[a-zA-Z0-9_.-]+$/.test(v)),
    field("Branch", "branch", v => /^[a-zA-Z0-9_./-]{1,100}$/.test(v)),
    field("OAuth-Anbieter", "base_url", v => v === "https://api.netlify.com"),
    field("Anmeldepfad", "auth_endpoint", v => v === "auth"),
    field("Website-Domain", "site_domain", v => /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/.test(v)),
  ];
}