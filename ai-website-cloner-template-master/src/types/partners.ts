export type PartnerCategory = "eventPlanner" | "photographer" | "designer" | "other";

export interface CountryPhoneCode {
  country: string;
  flag: string;
  code: string;
  // ISO 3166-1 alpha-2, shown alongside the dial code (e.g. "PS +970") so
  // the auto-synced badge reads clearly even when the flag glyph is small.
  iso: string;
}
