using Numinds.Api.Models.Entities;

namespace Numinds.Api.Data;

// Fixed GUIDs so `HasData` migrations stay stable across regeneration.
//
// Every template's ImageUrl (picker thumbnail) and BackgroundImageUrl (live
// canvas photo) now point at the *identical* Unsplash URL — the picker card
// can never show a different image than what the guest actually gets, which
// is the whole point of a template picker. This weren't always true: W024/
// W031/W029/W019/W103 originally kept their old baked-text *screenshot*
// thumbnails (w024.png etc., each with a demo couple's name burned into the
// pixels, e.g. W019 literally reads "Mohamed & Fatima") pointing at a
// *different* file than their new BackgroundImageUrl — technically correct
// (never composited live guest text over the baked-text screenshot) but
// confusing in practice: picking "W024" showed one image on the card and a
// completely different one on selection. Reusing the same text-free photo
// for both, exactly like W101/W102 already did, removes that mismatch
// entirely — see each entry's comment for why that specific photo was
// picked for that template's palette (dark burgundy florals for W024, a
// literal candlelit arch for W031, a blush wreath for W029, a minimalist
// veil for W019, cool rose peonies for W103 — distinct from W029's warmer
// peach), matching what numinds.me's own Studio renders for these designs
// (confirmed by comparing side-by-side screen recordings of both). The old
// w024.png/w031.jpeg/w029.png/w019.png screenshot files under
// public/images/templates/ are no longer referenced by any seed row but are
// left in place in case another template still wants a baked-preview
// thumbnail later.
//
// Layout="full-bleed" for all of these (the same treatment W101 already
// uses) is what actually makes BackgroundImageUrl render on the canvas —
// PageBg/CardBg/TextColor/PrimaryAccent/AmbientEffect stay as already tuned
// per entry, the photo layers in behind them exactly like W101/W102's own
// dark-glass theme sitting on top of their photo. This reverses an earlier,
// different attempt at photo backgrounds for these five that got reverted
// (see the AddMissingTemplateHeroIllustrations / RemoveMismatchedTemplateHeroPhotos
// migrations): that attempt assigned a generic stock photo to
// HeroIllustrationUrl — a small decorative-artwork slot meant for
// illustration, not full photography — so a literal "hands with rings"
// photo sat oddly next to the picker's soft cream/vector-styled card. This
// round is different: BackgroundImageUrl + Layout="full-bleed" is the
// full-photo hero treatment already proven by W101/W102, and each photo was
// hand-picked against that template's specific documented mood rather than
// a generic "wedding" stock query.
public static class SeedTemplates
{
    public static readonly Template[] All =
    [
        new Template
        {
            Id = Guid.Parse("8f14e45f-ceea-467e-adb2-000000000001"),
            Code = "W024",
            Category = "wedding",
            ImageUrl = "https://images.unsplash.com/photo-1673026190548-c95adc90ef60?w=800&q=80",
            BackgroundImageUrl = "https://images.unsplash.com/photo-1673026190548-c95adc90ef60?w=1200&q=80",
            Layout = "full-bleed",
            // Warm ivory-silk bg + deep burgundy accent/heading, echoing the
            // screenshot's maroon floral corners and bold serif caps —
            // BackgroundImageUrl's dark burgundy roses fading to black carry
            // the same maroon-floral mood as a real photo.
            PageBg = "#faf1ea,#fffdfa",
            CardBg = "#fbeee5",
            TextColor = "#5c1a26",
            PrimaryAccent = "#8c2a3a",
            DefaultNamesFont = "font-cinzel",
            // Falling/rotating petals — echoes the maroon floral corners.
            AmbientEffect = "petals",
            IsPopular = true,
        },
        new Template
        {
            Id = Guid.Parse("8f14e45f-ceea-467e-adb2-000000000002"),
            Code = "W031",
            Category = "wedding",
            ImageUrl = "https://images.unsplash.com/photo-1762621175799-5fc1e336e84a?w=800&q=80",
            BackgroundImageUrl = "https://images.unsplash.com/photo-1762621175799-5fc1e336e84a?w=1200&q=80",
            Layout = "full-bleed",
            // Dark warm taupe/brown bg + glowing cream accent, echoing the
            // screenshot's dark backlit arch-window scene — BackgroundImageUrl
            // is a literal candlelit stone archway with white florals, as
            // close a real-photo match to that description as it gets.
            PageBg = "#241d17,#332920",
            CardBg = "#2b2119",
            TextColor = "#F3E9DC",
            PrimaryAccent = "#D8C4A0",
            DefaultNamesFont = "font-cinzel",
            // Slow upward incense wisps — grounded directly in numinds.me's
            // own W038 (dark/moody wedding template), which keeps this same
            // smoke trail drifting the entire scroll height, not just the
            // hero.
            AmbientEffect = "smoke",
            IsPopular = false,
        },
        new Template
        {
            Id = Guid.Parse("8f14e45f-ceea-467e-adb2-000000000003"),
            Code = "W029",
            Category = "wedding",
            ImageUrl = "https://images.unsplash.com/photo-1526353043579-c836f1c675ad?w=800&q=80",
            BackgroundImageUrl = "https://images.unsplash.com/photo-1526353043579-c836f1c675ad?w=1200&q=80",
            Layout = "full-bleed",
            // Peach/terracotta bg + warm gold-brown accent, echoing the
            // screenshot's blush floral wreath — this photo is a literal
            // heart-shaped blush/white rose wreath — deliberately shifted
            // warmer than W103's cooler rose peonies so the two read as
            // distinct templates, not just distinct color tokens.
            PageBg = "#fdf6ec,#fffcf5",
            CardBg = "#fdf3e4",
            TextColor = "#6b4a2f",
            PrimaryAccent = "#c98a5a",
            DefaultNamesFont = "font-serif",
            AmbientEffect = "petals",
            IsPopular = false,
        },
        new Template
        {
            Id = Guid.Parse("8f14e45f-ceea-467e-adb2-000000000004"),
            Code = "W019",
            Category = "wedding",
            ImageUrl = "https://images.unsplash.com/photo-1584032910793-7aa893dbefda?w=800&q=80",
            BackgroundImageUrl = "https://images.unsplash.com/photo-1584032910793-7aa893dbefda?w=1200&q=80",
            Layout = "full-bleed",
            // Near-white bg + muted gray body text + gold script accent,
            // echoing the screenshot's minimalist cursive "Mohamed & Fatima"
            // treatment — italic serif is the closest FontSelect option to
            // that script feel. BackgroundImageUrl is a soft near-white/grey
            // hand-on-veil photo, matching the same minimalist mood.
            PageBg = "#ffffff,#fbfbf9",
            CardBg = "#ffffff",
            TextColor = "#5a5a54",
            PrimaryAccent = "#a68a4a",
            DefaultNamesFont = "italic font-serif",
            // Soft drifting motes — grounded in numinds.me's W039 (bright
            // sky/cloud wedding template), whose particles read as light
            // rather than falling snow/petals against a near-white minimalist
            // background.
            AmbientEffect = "sparkle",
            IsPopular = false,
        },
        new Template
        {
            Id = Guid.Parse("8f14e45f-ceea-467e-adb2-000000000005"),
            Code = "W101",
            Category = "wedding",
            // The original ImageUrl/BackgroundImageUrl-share pattern every
            // other template above now also follows.
            ImageUrl = "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800&q=80",
            BackgroundImageUrl = "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=1200&q=80",
            Layout = "full-bleed",
            // Deep forest-green glass palette matching the photo's foliage
            // tone — InvitationCanvas resolves these into section-card/text/
            // accent colors instead of the generic black/45 "any photo"
            // overlay every full-bleed template used to share.
            PageBg = "#0b1f16,#16291e",
            CardBg = "#0f2419",
            TextColor = "#DCEBD9",
            PrimaryAccent = "#8FBF9F",
            // Falling petals read as forest greenery drifting past the photo.
            AmbientEffect = "petals",
            IsPopular = true,
        },
        new Template
        {
            Id = Guid.Parse("8f14e45f-ceea-467e-adb2-000000000006"),
            Code = "W102",
            Category = "wedding",
            ImageUrl = "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
            BackgroundImageUrl = "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80",
            Layout = "boxed-hero",
            // Warm amber/ivory palette — distinct from both the deep-green
            // full-bleed template above and the app's default gold-on-cream,
            // proving the theme is read from this row's own tokens rather
            // than a shared "boxed-hero always looks like this" default.
            PageBg = "#fbf3e7,#fff9f0",
            CardBg = "#fffaf2",
            TextColor = "#4a3520",
            PrimaryAccent = "#b8823c",
            // A champagne-toast celebration reads as light/sparkle, not
            // falling particles.
            AmbientEffect = "sparkle",
            IsPopular = false,
        },
        new Template
        {
            Id = Guid.Parse("8f14e45f-ceea-467e-adb2-000000000007"),
            Code = "W103",
            Category = "wedding",
            ImageUrl = "https://images.unsplash.com/photo-1778186414142-7e4100e9f17d?w=800&q=80",
            BackgroundImageUrl = "https://images.unsplash.com/photo-1778186414142-7e4100e9f17d?w=1200&q=80",
            Layout = "full-bleed",
            // Blush/rose palette for the still cream-adjacent but distinctly
            // tinted theme — BackgroundImageUrl is cool-toned rose peonies,
            // deliberately cooler than W029's warmer peach wreath so the two
            // templates (which used to share a single w029.png thumbnail)
            // now read as distinct in the picker too, not just on selection.
            PageBg = "#fdf2f4,#fffbfc",
            CardBg = "#fff5f7",
            TextColor = "#6b2f3a",
            PrimaryAccent = "#c9748a",
            AmbientEffect = "petals",
            IsPopular = false,
        },

        // --- Non-wedding categories -----------------------------------------
        // Every row above is Category="wedding" — Step03Template's picker
        // (see templates.service.ts's getTemplates(category)) filters by the
        // occasion picked in Step02Occasion, and only falls back to the full
        // (wedding) list when that filtered query comes back empty. Until now
        // every other occasion (engagement, marriage contract, henna, bridal
        // shower, gender reveal, aqeeqah, graduation, birthday) always hit
        // that empty-list fallback, so picking any of them still showed
        // wedding-only templates — exactly what numinds.me doesn't do (its own
        // picker shows a "special designs" shelf of popular templates
        // regardless of category, plus a dedicated, category-coded shelf
        // below, e.g. "G004" for graduation). Two templates per category
        // below closes that gap. Same full-bleed pattern as W101/W102 above
        // (ImageUrl and BackgroundImageUrl share one text-free Unsplash photo,
        // Layout="full-bleed"), each photo picked to avoid two pitfalls hit
        // while sourcing the wedding ones: no real person's face (a stranger's
        // photo as *your* invitation background reads wrong) and no baked-in
        // text/branding (several graduation-themed candidates had another
        // graduate's actual embroidered name or a specific university's crest
        // baked into the shot — skipped for the same reason the original
        // baked-text wedding screenshots were).
        new Template
        {
            Id = Guid.Parse("8f14e45f-ceea-467e-adb2-000000000008"),
            Code = "E001",
            Category = "engagement",
            ImageUrl = "https://images.unsplash.com/photo-1686538246844-f3ca82434d95?w=800&q=80",
            BackgroundImageUrl = "https://images.unsplash.com/photo-1686538246844-f3ca82434d95?w=1200&q=80",
            Layout = "full-bleed",
            // Golden-hour ring-on-lace close-up — warm rose-gold palette.
            PageBg = "#fdf3ea,#fffaf5",
            CardBg = "#fbeee0",
            TextColor = "#7a4a35",
            PrimaryAccent = "#c9945a",
            AmbientEffect = "sparkle",
            IsPopular = true,
        },
        new Template
        {
            Id = Guid.Parse("8f14e45f-ceea-467e-adb2-000000000009"),
            Code = "E002",
            Category = "engagement",
            ImageUrl = "https://images.unsplash.com/photo-1639078007551-b14a57d62c8d?w=800&q=80",
            BackgroundImageUrl = "https://images.unsplash.com/photo-1639078007551-b14a57d62c8d?w=1200&q=80",
            Layout = "full-bleed",
            // Cooler-toned couple's-hands-and-ring moment — deliberately
            // cooler/neutral than E001's warm gold so the two read distinct.
            PageBg = "#f3efe9,#fdfdfb",
            CardBg = "#f7f4ef",
            TextColor = "#5a5652",
            PrimaryAccent = "#a89a86",
            AmbientEffect = "sparkle",
            IsPopular = false,
        },
        new Template
        {
            Id = Guid.Parse("8f14e45f-ceea-467e-adb2-00000000000a"),
            Code = "Q001",
            Category = "marriage_contract",
            ImageUrl = "https://images.unsplash.com/photo-1596911942922-521ec0db907d?w=800&q=80",
            BackgroundImageUrl = "https://images.unsplash.com/photo-1596911942922-521ec0db907d?w=1200&q=80",
            Layout = "full-bleed",
            // Sheikh Zayed Grand Mosque's golden floral colonnade — cream/gold
            // Islamic-architecture palette.
            PageBg = "#faf5e8,#fffdf7",
            CardBg = "#f7efd9",
            TextColor = "#5c4a1f",
            PrimaryAccent = "#b8963c",
            DefaultNamesFont = "font-cinzel",
            AmbientEffect = "sparkle",
            IsPopular = true,
        },
        new Template
        {
            Id = Guid.Parse("8f14e45f-ceea-467e-adb2-00000000000b"),
            Code = "Q002",
            Category = "marriage_contract",
            ImageUrl = "https://images.unsplash.com/photo-1730376475964-0e196eb95a6e?w=800&q=80",
            BackgroundImageUrl = "https://images.unsplash.com/photo-1730376475964-0e196eb95a6e?w=1200&q=80",
            Layout = "full-bleed",
            // A Quran with red prayer beads on a navy/gold ornate cover — a
            // deep, moody dark-navy palette, distinct from Q001's cream/gold.
            PageBg = "#111a2e,#1c2740",
            CardBg = "#16203a",
            TextColor = "#e8d9a8",
            PrimaryAccent = "#c9a13c",
            DefaultNamesFont = "font-cinzel",
            AmbientEffect = "smoke",
            IsPopular = false,
        },
        new Template
        {
            Id = Guid.Parse("8f14e45f-ceea-467e-adb2-00000000000c"),
            Code = "H001",
            Category = "henna",
            ImageUrl = "https://images.unsplash.com/photo-1771992230505-97e0c3d38213?w=800&q=80",
            BackgroundImageUrl = "https://images.unsplash.com/photo-1771992230505-97e0c3d38213?w=1200&q=80",
            Layout = "full-bleed",
            // Henna-patterned hand with marigold garlands — vivid warm
            // orange/terracotta, echoing the marigold's own color.
            PageBg = "#fdece0,#fff8f0",
            CardBg = "#fde2c8",
            TextColor = "#7a3a1a",
            PrimaryAccent = "#d9741f",
            AmbientEffect = "petals",
            IsPopular = true,
        },
        new Template
        {
            Id = Guid.Parse("8f14e45f-ceea-467e-adb2-00000000000d"),
            Code = "H002",
            Category = "henna",
            ImageUrl = "https://images.unsplash.com/photo-1771992228898-79342c9c1c39?w=800&q=80",
            BackgroundImageUrl = "https://images.unsplash.com/photo-1771992228898-79342c9c1c39?w=1200&q=80",
            Layout = "full-bleed",
            // A second, front-facing henna+marigold portrait — shifted toward
            // a deeper maroon/red accent so it reads distinct from H001.
            PageBg = "#fbe4d8,#fff6f0",
            CardBg = "#fbd9c4",
            TextColor = "#6b2a1a",
            PrimaryAccent = "#c0392b",
            AmbientEffect = "petals",
            IsPopular = false,
        },
        new Template
        {
            Id = Guid.Parse("8f14e45f-ceea-467e-adb2-00000000000e"),
            Code = "S001",
            Category = "bridal_shower",
            ImageUrl = "https://images.unsplash.com/photo-1727178757622-26389a0538f5?w=800&q=80",
            BackgroundImageUrl = "https://images.unsplash.com/photo-1727178757622-26389a0538f5?w=1200&q=80",
            Layout = "full-bleed",
            // Pink-and-gold balloon cluster — soft rose palette.
            PageBg = "#fdf1f3,#fffbfc",
            CardBg = "#fbe4e8",
            TextColor = "#8a3f52",
            PrimaryAccent = "#d88a9e",
            AmbientEffect = "sparkle",
            IsPopular = true,
        },
        new Template
        {
            Id = Guid.Parse("8f14e45f-ceea-467e-adb2-00000000000f"),
            Code = "S002",
            Category = "bridal_shower",
            ImageUrl = "https://images.unsplash.com/photo-1581022295432-7fabcc628434?w=800&q=80",
            BackgroundImageUrl = "https://images.unsplash.com/photo-1581022295432-7fabcc628434?w=1200&q=80",
            Layout = "full-bleed",
            // Pastel-pink floral flat-lay — a softer, more muted blush than
            // S001's rose/gold balloons.
            PageBg = "#fbeaf0,#fff8fa",
            CardBg = "#f9dee6",
            TextColor = "#7a3f52",
            PrimaryAccent = "#e0a0b8",
            AmbientEffect = "petals",
            IsPopular = false,
        },
        new Template
        {
            Id = Guid.Parse("8f14e45f-ceea-467e-adb2-000000000010"),
            Code = "R001",
            Category = "gender_reveal",
            ImageUrl = "https://images.unsplash.com/photo-1768776181652-d640d88a75f0?w=800&q=80",
            BackgroundImageUrl = "https://images.unsplash.com/photo-1768776181652-d640d88a75f0?w=1200&q=80",
            Layout = "full-bleed",
            // "BABY" balloon marquee in pink/blue/gold — a neutral soft-lavender
            // palette that bridges both colors rather than picking a side.
            PageBg = "#f0eef7,#fbfaff",
            CardBg = "#e8e5f5",
            TextColor = "#4a4568",
            PrimaryAccent = "#9b8fc9",
            AmbientEffect = "sparkle",
            IsPopular = true,
        },
        new Template
        {
            Id = Guid.Parse("8f14e45f-ceea-467e-adb2-000000000011"),
            Code = "R002",
            Category = "gender_reveal",
            ImageUrl = "https://images.unsplash.com/photo-1560128411-79892dd93bf8?w=800&q=80",
            BackgroundImageUrl = "https://images.unsplash.com/photo-1560128411-79892dd93bf8?w=1200&q=80",
            Layout = "full-bleed",
            // Pink/blue/gold balloon arch with a fairy-lit curtain — shifted
            // toward a soft sky-blue palette, distinct from R001's lavender.
            PageBg = "#eaf2fb,#f8fbff",
            CardBg = "#dcebfa",
            TextColor = "#2f4a68",
            PrimaryAccent = "#7fa8d9",
            AmbientEffect = "sparkle",
            IsPopular = false,
        },
        new Template
        {
            Id = Guid.Parse("8f14e45f-ceea-467e-adb2-000000000012"),
            Code = "A001",
            Category = "aqeeqah",
            ImageUrl = "https://images.unsplash.com/photo-1704649917979-9a23d585da95?w=800&q=80",
            BackgroundImageUrl = "https://images.unsplash.com/photo-1704649917979-9a23d585da95?w=1200&q=80",
            Layout = "full-bleed",
            // Newborn asleep in a tiny wooden bed, cream knit outfit — warm
            // neutral ivory/beige palette.
            PageBg = "#faf6ee,#fffdf8",
            CardBg = "#f5eee0",
            TextColor = "#6b5a3f",
            PrimaryAccent = "#c9b183",
            AmbientEffect = "sparkle",
            IsPopular = true,
        },
        new Template
        {
            Id = Guid.Parse("8f14e45f-ceea-467e-adb2-000000000013"),
            Code = "A002",
            Category = "aqeeqah",
            ImageUrl = "https://images.unsplash.com/photo-1741840800730-785888bd32c2?w=800&q=80",
            BackgroundImageUrl = "https://images.unsplash.com/photo-1741840800730-785888bd32c2?w=1200&q=80",
            Layout = "full-bleed",
            // Newborn in a blush-pink floral headband — dustier pink than
            // A001's neutral ivory.
            PageBg = "#fbeef0,#fff9fa",
            CardBg = "#f7dee2",
            TextColor = "#7a4a52",
            PrimaryAccent = "#d98fa0",
            AmbientEffect = "petals",
            IsPopular = false,
        },
        new Template
        {
            Id = Guid.Parse("8f14e45f-ceea-467e-adb2-000000000014"),
            Code = "G001",
            Category = "graduation",
            ImageUrl = "https://images.unsplash.com/photo-1636231945376-3d40fdcbc462?w=800&q=80",
            BackgroundImageUrl = "https://images.unsplash.com/photo-1636231945376-3d40fdcbc462?w=1200&q=80",
            Layout = "full-bleed",
            // A single cap-and-tassel still life, framed by green leaves — a
            // deep academic-green dark palette (no institution branding
            // visible, unlike several candidates sourcing this one).
            PageBg = "#0f1f18,#182e24",
            CardBg = "#13291f",
            TextColor = "#dcece0",
            PrimaryAccent = "#5fae7f",
            AmbientEffect = "sparkle",
            IsPopular = true,
        },
        new Template
        {
            Id = Guid.Parse("8f14e45f-ceea-467e-adb2-000000000015"),
            Code = "G002",
            Category = "graduation",
            ImageUrl = "https://images.unsplash.com/photo-1785052335573-8c0bcd811c5b?w=800&q=80",
            BackgroundImageUrl = "https://images.unsplash.com/photo-1785052335573-8c0bcd811c5b?w=1200&q=80",
            Layout = "full-bleed",
            // Graduation caps thrown into the air with gold confetti streamers
            // — an energetic warm-gold/cream palette, distinct from G001's
            // single-cap dark green.
            PageBg = "#fdf6e3,#fffcf0",
            CardBg = "#f7ecc4",
            TextColor = "#6b5518",
            PrimaryAccent = "#c9a227",
            AmbientEffect = "sparkle",
            IsPopular = false,
        },
        new Template
        {
            Id = Guid.Parse("8f14e45f-ceea-467e-adb2-000000000016"),
            Code = "B001",
            Category = "birthday",
            ImageUrl = "https://images.unsplash.com/photo-1762918988304-97d4a5840a4a?w=800&q=80",
            BackgroundImageUrl = "https://images.unsplash.com/photo-1762918988304-97d4a5840a4a?w=1200&q=80",
            Layout = "full-bleed",
            // Cream cake with a gold ribbon bow amid gold confetti balloons —
            // warm champagne-gold palette.
            PageBg = "#fbf3e6,#fffcf5",
            CardBg = "#f7ead0",
            TextColor = "#6b5220",
            PrimaryAccent = "#c9a13c",
            AmbientEffect = "sparkle",
            IsPopular = true,
        },
        new Template
        {
            Id = Guid.Parse("8f14e45f-ceea-467e-adb2-000000000017"),
            Code = "B002",
            Category = "birthday",
            ImageUrl = "https://images.unsplash.com/photo-1780586382191-bef9c740798e?w=800&q=80",
            BackgroundImageUrl = "https://images.unsplash.com/photo-1780586382191-bef9c740798e?w=1200&q=80",
            Layout = "full-bleed",
            // White balloon dessert-table display against tropical greenery —
            // a fresh, soft mint-green palette, distinct from B001's warm gold.
            PageBg = "#eef7f0,#fbfffb",
            CardBg = "#dff0e3",
            TextColor = "#2f5240",
            PrimaryAccent = "#7fbf95",
            AmbientEffect = "sparkle",
            IsPopular = false,
        },

        // W104 — "Nikkah Wax Seal": the four opt-in scene-style switches
        // (EnvelopeStyle/HeroFrameStyle/DateRevealStyle/InvitationCardStyle)
        // all in one place, cloned from a reference video of an embossed
        // cream envelope + wax-seal monogram opening into a scalloped
        // Mughal-arch hero photo, a "scratch to reveal the date" card, and a
        // Bismillah-headed formal invitation card with parents' names.
        new Template
        {
            Id = Guid.Parse("8f14e45f-ceea-467e-adb2-000000000018"),
            Code = "W106",
            Category = "wedding",
            // Picker-grid thumbnail stays a static photo (autoplaying every
            // card in the catalog grid would be wasteful/distracting) — the
            // live canvas's BackgroundImageUrl below is what actually plays,
            // a real royalty-free 1920x1080/25fps clip (Pexels, "Majestic
            // Mosque Silhouette at Sunset" by Dr Photographer,
            // https://www.pexels.com/video/majestic-mosque-silhouette-at-sunset-33588485/,
            // free for commercial use) so the arch frame shows genuine
            // ambient motion — drifting clouds, shifting sunset light —
            // instead of a still frame. No people in shot (same
            // no-real-person's-face rule every other seed photo above
            // follows), which also matches Layout="boxed-hero": only the
            // hero's own arch-window frame shows this clip, so it reads as
            // the backdrop glimpsed *through* the arch rather than a
            // full-page background. InvitationCanvas/ArchIslamicHeroFrame
            // detect the .mp4 extension (isVideoSource in lib/utils.ts) and
            // render <video autoPlay loop muted playsInline> instead of
            // next/image automatically — no extra config needed here beyond
            // pointing this field at the file.
            ImageUrl = "https://images.unsplash.com/photo-1572280075160-be1ab588d4d6?w=800&q=80",
            BackgroundImageUrl = "https://videos.pexels.com/video-files/33588485/14277788_1920_1080_25fps.mp4",
            Layout = "boxed-hero",
            // Warm ivory/cream palette + deep gold-brown text, matching the
            // reference video's embossed-paper-and-gold-foil look.
            PageBg = "#f7f0e0,#fffcf5",
            CardBg = "#fbf4e4",
            TextColor = "#5c4826",
            PrimaryAccent = "#b8923f",
            // Closest existing FontSelect value to the reference's flowing
            // cursive names (Daanish/Adeena) — FontSelect has no dedicated
            // script option beyond this.
            DefaultNamesFont = "italic font-serif",
            AmbientEffect = "sparkle",
            EnvelopeStyle = "waxseal",
            HeroFrameStyle = "archIslamic",
            DateRevealStyle = "scratch",
            InvitationCardStyle = "archIslamic",
            IsPopular = true,
        },
    ];
}
