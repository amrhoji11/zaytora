export interface SacredIvoryHeritageTheme {
  colors: {
    /** Deep burgundy — names, dividers, date label */
    primary: string;
    primaryLight: string;
    cream: string;
    creamDark: string;
    gold: string;
    goldLight: string;
    sage: string;
    blush: string;
  };
  fonts: {
    /** Couple names, "&" glyph */
    names: string;
    /** "We are getting married" style tagline */
    tagline: string;
    /** Uppercase date line */
    dateLabel: string;
    /** Opening-sequence italic quote */
    quote: string;
  };
}

export interface SacredIvoryHeritageProps {
  /** Groom's display name, e.g. "Mohammed" */
  groomName: string;
  /** Bride's display name, e.g. "Leila" */
  brideName: string;
  /** ISO date (YYYY-MM-DD) the event starts */
  startDate: string;
  /** ISO date (YYYY-MM-DD) the event ends, for multi-day events. Omit for a single-day event. */
  endDate?: string;
  /** Locale used to format startDate/endDate, defaults to "en-US" */
  dateLocale?: string;
  /** Defaults to "We are getting married" */
  tagline?: string;
  /** Defaults to "You are invited for our special day" */
  openingQuote?: string;
  /** Video played once before the card reveals. Omit (or set skipOpening) to land directly on the card. */
  openingVideoSrc?: string;
  /** Looping ambient video behind the revealed card. Falls back to backgroundPosterSrc as a static image if omitted. */
  backgroundVideoSrc?: string;
  /** Static poster/background image — required as the fallback for backgroundVideoSrc and the opening sequence's first paint. */
  backgroundPosterSrc: string;
  /** Skip the opening video entirely and land straight on the invitation card. */
  skipOpening?: boolean;
  /** Deep-merged over the default palette/fonts. */
  theme?: Partial<{
    colors: Partial<SacredIvoryHeritageTheme["colors"]>;
    fonts: Partial<SacredIvoryHeritageTheme["fonts"]>;
  }>;
  /** Fires once when the opening sequence finishes (video ends or is skipped by the guest). */
  onOpeningComplete?: () => void;
}
