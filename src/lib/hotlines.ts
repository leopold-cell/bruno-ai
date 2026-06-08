export type Hotline = { name: string; number: string; text?: string; note?: string };

const REGIONS: Record<string, { label: string; lines: Hotline[] }> = {
  US: {
    label: "United States",
    lines: [
      { name: "988 Suicide & Crisis Lifeline", number: "988", text: "Text 988", note: "Free, 24/7" },
      { name: "Crisis Text Line", number: "Text HOME to 741741" },
    ],
  },
  UK: {
    label: "United Kingdom",
    lines: [
      { name: "Samaritans", number: "116 123", note: "Free, 24/7" },
      { name: "SHOUT", number: "Text SHOUT to 85258" },
    ],
  },
  DE: {
    label: "Deutschland",
    lines: [
      { name: "Telefonseelsorge", number: "0800 111 0 111", note: "Kostenlos, 24/7" },
      { name: "Nummer gegen Kummer (Jugend)", number: "116 111" },
    ],
  },
  CA: {
    label: "Canada",
    lines: [{ name: "Talk Suicide Canada", number: "1-833-456-4566", note: "24/7" }],
  },
  AU: {
    label: "Australia",
    lines: [{ name: "Lifeline", number: "13 11 14", note: "24/7" }],
  },
  EU: {
    label: "Europe",
    lines: [{ name: "European Emergency", number: "112" }, { name: "Samaritans (English)", number: "116 123" }],
  },
};

export function getHotlines(region: string | null | undefined) {
  const key = (region ?? "US").toUpperCase();
  return REGIONS[key] ?? REGIONS.US;
}

export const REGION_OPTIONS = Object.entries(REGIONS).map(([code, v]) => ({ code, label: v.label }));
