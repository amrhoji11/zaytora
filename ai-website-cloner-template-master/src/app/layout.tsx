import type { Metadata } from "next";
import {
  Cinzel,
  Great_Vibes,
  Cairo,
  IBM_Plex_Sans_Arabic,
  Aref_Ruqaa,
  Rakkas,
  Lalezar,
  Jomhuria,
  Katibeh,
  Changa,
  Amiri,
  Reem_Kufi,
  El_Messiri,
  Marhey,
  Mada,
  Harmattan,
  Tajawal,
  Almarai,
  Noto_Naskh_Arabic,
  Scheherazade_New,
  Lateef,
  Playfair_Display,
  Dancing_Script,
  Cormorant_Garamond,
  Herr_Von_Muellerhoff,
  Noto_Nastaliq_Urdu,
} from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { AuthProvider } from "@/context/AuthContext";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { ThemeProvider } from "@/context/ThemeContext";

// Runs before hydration so the correct theme class is already on <html>
// by first paint — without this, ThemeProvider's own useEffect would apply
// the class a frame too late, flashing the wrong theme. Defaults to dark
// (the site's current look) when no preference has been saved yet.
const NO_FLASH_THEME_SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem("zaytora-theme");
    var theme = stored === "light" ? "light" : "dark";
    document.documentElement.classList.toggle("dark", theme === "dark");
  } catch (e) {
    document.documentElement.classList.add("dark");
  }
})();
`;

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  // Cinzel has no Arabic glyphs; Next's auto-generated Latin-metric
  // fallback substitutes unpredictably for Arabic text (causing extra
  // line wraps). Fall back to a plain "serif" instead, matching the
  // reference site's font stack.
  adjustFontFallback: false,
  fallback: ["serif"],
});

// Reserved for the "&" glyph specifically — the reference invitation markup
// (captured off a live Numinds-family site) sets every couple-name "&" in
// Great Vibes while the surrounding names stay in the invitation's own font,
// never the whole names string, since Great Vibes has no Arabic glyphs.
const greatVibes = Great_Vibes({
  variable: "--font-great-vibes",
  subsets: ["latin"],
  weight: "400",
  adjustFontFallback: false,
  fallback: ["cursive"],
});

// The event-title/names/invitation-text font picker's real options (see
// FontSelect.tsx) — self-hosted Google Fonts spanning Arabic calligraphy
// styles (Ruqaa, Kufi, Naskh, Nastaliq) and a few Latin display faces,
// each exposed as a CSS variable + ".font-<slug>" utility (globals.css).
// preload: false on all of these — they're only ever rendered inside the
// Studio (font pickers, invitation preview) and the public invitation page,
// never on marketing pages. Without this, Next injects a <link rel=preload>
// for all 24 font files into every single page's <head> (they're declared
// in this root layout), forcing ~30 unnecessary font downloads on every
// page load site-wide. preload:false still lets the browser fetch a file
// normally the moment matching text actually needs it.
const cairo = Cairo({ variable: "--font-cairo", subsets: ["arabic", "latin"], weight: "400", preload: false });
const ibmPlexArabic = IBM_Plex_Sans_Arabic({ variable: "--font-ibm-plex-arabic", subsets: ["arabic"], weight: "400", preload: false });
const arefRuqaa = Aref_Ruqaa({ variable: "--font-aref-ruqaa", subsets: ["arabic"], weight: "400", preload: false });
const rakkas = Rakkas({ variable: "--font-rakkas", subsets: ["arabic", "latin"], weight: "400", preload: false });
const lalezar = Lalezar({ variable: "--font-lalezar", subsets: ["arabic", "latin"], weight: "400", preload: false });
const jomhuria = Jomhuria({ variable: "--font-jomhuria", subsets: ["latin"], weight: "400", preload: false });
const katibeh = Katibeh({ variable: "--font-katibeh", subsets: ["arabic", "latin"], weight: "400", preload: false });
const changa = Changa({ variable: "--font-changa", subsets: ["arabic", "latin"], weight: "400", preload: false });
const amiri = Amiri({ variable: "--font-amiri", subsets: ["arabic", "latin"], weight: "400", preload: false });
const reemKufi = Reem_Kufi({ variable: "--font-reem-kufi", subsets: ["arabic", "latin"], weight: "400", preload: false });
const elMessiri = El_Messiri({ variable: "--font-el-messiri", subsets: ["arabic", "latin"], weight: "400", preload: false });
const marhey = Marhey({ variable: "--font-marhey", subsets: ["arabic", "latin"], weight: "400", preload: false });
const mada = Mada({ variable: "--font-mada", subsets: ["arabic", "latin"], weight: "400", preload: false });
const harmattan = Harmattan({ variable: "--font-harmattan", subsets: ["arabic"], weight: "400", preload: false });
const tajawal = Tajawal({ variable: "--font-tajawal", subsets: ["arabic", "latin"], weight: "400", preload: false });
const almarai = Almarai({ variable: "--font-almarai", subsets: ["arabic"], weight: "400", preload: false });
const notoNaskh = Noto_Naskh_Arabic({ variable: "--font-noto-naskh", subsets: ["arabic"], weight: "400", preload: false });
const scheherazade = Scheherazade_New({ variable: "--font-scheherazade", subsets: ["arabic"], weight: "400", preload: false });
const lateef = Lateef({ variable: "--font-lateef", subsets: ["arabic"], weight: "400", preload: false });
const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"], weight: "400", preload: false });
const dancingScript = Dancing_Script({ variable: "--font-dancing-script", subsets: ["latin"], weight: "400", preload: false });
const cormorant = Cormorant_Garamond({ variable: "--font-cormorant", subsets: ["latin"], weight: "400", preload: false });
const herrVonMuellerhoff = Herr_Von_Muellerhoff({ variable: "--font-herr-von-muellerhoff", subsets: ["latin"], weight: "400", preload: false });
// Nastaliq is the Perso-Arabic calligraphy style whose diagonal, joined
// strokes read as "flowing script" the way Latin cursive faces (Herr Von
// Muellerhoff, Great Vibes) do for Latin text — the closest real match for
// an elegant connected look when the invitation text itself is Arabic.
const notoNastaliq = Noto_Nastaliq_Urdu({ variable: "--font-noto-nastaliq", subsets: ["arabic"], weight: "400", preload: false });

const CURATED_FONT_VARIABLES = [
  cairo,
  ibmPlexArabic,
  arefRuqaa,
  rakkas,
  lalezar,
  jomhuria,
  katibeh,
  changa,
  amiri,
  reemKufi,
  elMessiri,
  marhey,
  mada,
  harmattan,
  tajawal,
  almarai,
  notoNaskh,
  scheherazade,
  lateef,
  playfair,
  dancingScript,
  cormorant,
  herrVonMuellerhoff,
  notoNastaliq,
]
  .map((font) => font.variable)
  .join(" ");

export const metadata: Metadata = {
  title: "ZAYTORA",
  description:
    "تصميم دعوات رقمية أنيقة في دقائق | Create elegant digital invitations in minutes.",
  icons: {
    icon: "/seo/favicon.png",
  },
};

// Header/Footer/WhatsAppButton live in (site)/layout.tsx, not here — guest-
// facing routes like /invitationpublic sit outside that group specifically
// so they render as a standalone page with no marketing-site chrome,
// matching the reference invitation page.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${cinzel.variable} ${greatVibes.variable} ${CURATED_FONT_VARIABLES} h-full antialiased dark`}
      // Next.js 16 stopped auto-overriding CSS scroll-behavior during
      // route transitions (see the "Scroll Behavior Override" section of
      // its v16 upgrade guide) — this site sets `scroll-behavior: smooth`
      // globally, and without this attribute Next's own scroll-to-top on
      // navigation just animates smoothly instead of jumping instantly,
      // which was landing incomplete/interrupted and leaving the new page
      // scrolled to wherever the previous page had been (e.g. clicking
      // "View Pricing" partway down the home page landed on /Prices still
      // scrolled to the bottom instead of resetting to the top).
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: NO_FLASH_THEME_SCRIPT }} />
        {/* The envelope-open tap calls music.play() immediately (see
            InvitationCanvas/useMusicPlayer), but every preset track is a
            YouTube link (musicLibrary.ts) — playback only actually starts
            once the IFrame API script has loaded and its player fires
            onReady. Preconnecting these hosts here (loaded on every page,
            same as the theme script above) lets the DNS+TLS handshake
            happen in the background before a guest ever reaches the
            envelope, instead of only starting once loadYouTubeIframeApi()
            is first called on the invitation page itself. */}
        <link rel="preconnect" href="https://www.youtube.com" />
        <link rel="preconnect" href="https://www.google.com" />
        <link rel="preconnect" href="https://i.ytimg.com" />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground" suppressHydrationWarning>
        <ThemeProvider>
          <AuthProvider>
            <LanguageProvider>
              <CurrencyProvider>{children}</CurrencyProvider>
            </LanguageProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
