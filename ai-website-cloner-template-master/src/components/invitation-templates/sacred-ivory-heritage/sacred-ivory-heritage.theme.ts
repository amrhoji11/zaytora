import type { SacredIvoryHeritageTheme } from "./sacred-ivory-heritage.types";

// Palette lifted 1:1 from the reference markup's CSS custom properties
// (--burgundy, --cream, --gold, --sage, --blush, all given as HSL triples).
// Kept as hsl() strings rather than hand-converted hex so the exact values
// are traceable back to the source instead of a manual conversion that
// could silently drift.
export const defaultTheme: SacredIvoryHeritageTheme = {
  colors: {
    primary: "hsl(350 40% 35%)",
    primaryLight: "hsl(350 35% 45%)",
    cream: "hsl(35 30% 96%)",
    creamDark: "hsl(35 25% 90%)",
    gold: "hsl(42 70% 55%)",
    goldLight: "hsl(42 60% 70%)",
    sage: "hsl(140 20% 45%)",
    blush: "hsl(350 30% 90%)",
  },
  fonts: {
    names: "var(--sih-font-cinzel-decorative)",
    tagline: "var(--sih-font-dancing-script)",
    dateLabel: "var(--sih-font-cinzel-decorative)",
    quote: "var(--sih-font-cinzel)",
  },
};
