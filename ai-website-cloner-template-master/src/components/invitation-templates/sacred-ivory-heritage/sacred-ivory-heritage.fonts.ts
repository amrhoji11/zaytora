import { Cinzel, Cinzel_Decorative, Dancing_Script, Playfair_Display } from "next/font/google";

// Scoped to this template only (variable names prefixed --sih-, distinct
// from the app-wide --font-* set in the root layout) so this stays a true
// standalone preview -- nothing here touches global font loading or the
// site's real template system.
export const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--sih-font-cinzel",
  preload: false,
});

export const cinzelDecorative = Cinzel_Decorative({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--sih-font-cinzel-decorative",
  preload: false,
});

export const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--sih-font-dancing-script",
  preload: false,
});

export const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--sih-font-playfair",
  preload: false,
});
