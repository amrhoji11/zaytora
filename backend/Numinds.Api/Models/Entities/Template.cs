namespace Numinds.Api.Models.Entities;

public class Template
{
    public Guid Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;

    // The picker-grid thumbnail (Step03Template / TemplateCard) — a finished
    // preview image that may have baked-in demo names/dates burned into its
    // pixels, exactly like every template screenshot currently seeded below.
    // Fine for "here's roughly what this template looks like" in a grid of
    // small cards; wrong to composite live guest data on top of, since the
    // demo text is part of the image itself, not something dynamic text can
    // replace.
    public string ImageUrl { get; set; } = string.Empty;

    // The clean, text-free asset InvitationCanvas actually composites the
    // couple's live names/dates over. Null for a template whose only known
    // asset is the baked-text thumbnail above (see w024/w029/w019/w031 in
    // SeedTemplates) — those render on the plain cream/gold theme instead of
    // trying to layer real text over demo text that's already in the pixels.
    public string? BackgroundImageUrl { get; set; }

    // How BackgroundImageUrl (when present) gets composited into the canvas:
    // "full-bleed" — stretches behind the entire scrollable page, matching
    //   this project's original single-mode photo treatment.
    // "boxed-hero" — confined to a bounded, rounded card in the hero only;
    //   every other section stays on the plain cream/gold theme. Matches
    //   numinds.me's own template style observed directly on the live site.
    // "overlay" — a decorative frame/ornament layered on top of the cream
    //   theme rather than a background photo at all.
    // "none" — no compositing; BackgroundImageUrl is ignored even if set.
    // Plain string (not a C# enum) so a template can carry a layout value
    // this API version doesn't recognize yet without failing to deserialize
    // — InvitationCanvas already falls back to "full-bleed" for any
    // unrecognized non-"none" value.
    public string Layout { get; set; } = "none";

    // Theme palette tokens InvitationCanvas resolves into CSS custom
    // properties (see resolveCanvasTheme in InvitationCanvas.tsx) so a
    // template's section cards, text, and accent color inherit its actual
    // brand tone instead of one generic cream/gold look shared by every
    // photo-less template. All four are optional plain hex colors
    // ("#0f2419") — null falls back to the original hasPhoto-driven look
    // (dark glass on a full-bleed photo, cream/gold otherwise). Every
    // template in SeedTemplates now sets its own, including w024/w029/w019/
    // w031: they have no BackgroundImageUrl, but assigning them Layout=
    // "overlay" plus a distinct palette here is exactly how a template with
    // no clean text-free photo still renders a unique look instead of one
    // shared fallback.
    //
    // PageBg — the canvas root background: a solid hex, or two comma-
    // separated hex stops ("#0b1f16,#16291e") for a top-to-bottom gradient.
    public string? PageBg { get; set; }
    // CardBg — base color the section cards' translucent glass fill/border/
    // shadow are derived from (alpha-blended client-side, not stored as
    // rgba here).
    public string? CardBg { get; set; }
    // TextColor — heading/strong text color; body/muted are alpha-blended
    // variants of it.
    public string? TextColor { get; set; }
    // PrimaryAccent — icons, decorative rings, chip highlights, timeline
    // dots; replaces the app's default gold (#c8a24a) for this template.
    public string? PrimaryAccent { get; set; }

    // The font utility class InvitationCanvas applies to the couple's live
    // names (hero, invitation card, footer) when the guest hasn't picked
    // their own via Step04BasicInfo's FontSelect — lets a template like the
    // script-heavy w019 read as genuinely different from the bold-caps w024
    // even though both are photo-less. One of FontSelect's own option
    // values ("font-cinzel" | "font-serif" | "font-sans" | "italic
    // font-serif"); null falls back to the app-wide default (font-cinzel).
    public string? DefaultNamesFont { get; set; }

    // Decorative artwork independent of BackgroundImageUrl/Layout, so a
    // photo-less template ("overlay"/"none") isn't limited to flat color +
    // border for its visual identity.
    //
    // HeroIllustrationUrl — rendered full-screen (absolute inset-0,
    // object-cover), exactly like BackgroundImageUrl's full-bleed treatment,
    // rather than a small centered box — only shown when the template has no
    // BackgroundImageUrl hero photo already occupying that slot (full-bleed/
    // boxed-hero templates keep their arch-window photo frame there
    // instead). Each template should point at its own distinct image; never
    // reuse the same URL across templates, or picking two different photo-
    // less templates renders the identical background.
    public string? HeroIllustrationUrl { get; set; }
    // DecorationImageUrl — a smaller recurring divider ornament between the
    // hero and the main invitation card, filling what used to be bare empty
    // space for every layout, photo-backed or not.
    public string? DecorationImageUrl { get; set; }

    // Which ambient particle animation drifts across the whole canvas (see
    // AmbientParticles.tsx) — grounded directly in numinds.me's own live
    // templates, which keep a persistent motion layer running the entire
    // scroll height, not just in the hero: "smoke" (slow upward wisps,
    // dark/moody templates — matches W038's incense trail), "petals" (falling
    // + gently rotating, floral templates), "sparkle" (soft drifting motes,
    // bright/sky templates — matches W039), "snow" (this app's original
    // straight-down drift), "none" (no particle layer). Null defers to
    // isDark ("smoke" when dark, "sparkle" when light) rather than forcing
    // every template to set this explicitly.
    public string? AmbientEffect { get; set; }

    public bool IsPopular { get; set; }

    // Explicit admin pin for the homepage teaser grid (TemplatesGrid.tsx),
    // separate from IsPopular (which only affects general list ordering).
    // GET /api/templates/homepage always returns exactly 4 templates: these
    // first (ordered by real usage), then auto-filled by usage count for any
    // remaining slots — so the homepage never shows fewer than 4 just
    // because an admin hasn't picked any yet. Capped at 4 server-side (see
    // TemplatesController.SetHomepageFeatured).
    public bool IsHomepageFeatured { get; set; }

    // Four opt-in "scene style" switches for visual behavior InvitationCanvas
    // doesn't already express through the palette/layout/ambient tokens above
    // — each one swaps out one specific rendering block for a fully different
    // treatment, but only for a template that explicitly asks for it; every
    // existing template leaves all four null/"none" and renders exactly as it
    // did before these were added. Plain strings (like Layout/AmbientEffect
    // above), not C# enums, so an unrecognized value safely falls back to the
    // classic look rather than failing to deserialize.
    //
    // EnvelopeStyle — the guest's very first tap-to-open screen. "waxseal"
    // swaps EnvelopeCover's blurred-photo-badge for an embossed cream paper
    // envelope with a circular wax-seal initials badge, an idle shimmer
    // sweep across its floral engraving, and a golden light-beam crossfade
    // into the hero on open. Null/anything else keeps the original cover.
    public string? EnvelopeStyle { get; set; }

    // HeroFrameStyle — the hero's bounded photo frame. "archIslamic" replaces
    // the plain rounded-top arch window with a wider, multi-lobed scalloped
    // Mughal/mihrab arch, carved pillar sides, hanging lantern silhouettes,
    // and floral corner accents. Null/anything else keeps the original
    // simple arch window (or no frame, for a photo-less template).
    public string? HeroFrameStyle { get; set; }

    // DateRevealStyle — an optional section rendered right after the hero.
    // "scratch" adds a "The Date" scratch-to-reveal card: three foil boxes
    // (day/month/year) the guest drags a finger across to erase, revealing
    // the real EventDateTime underneath. Null/"none" renders no such section
    // (every template's previous behavior).
    public string? DateRevealStyle { get; set; }

    // InvitationCardStyle — the main calligraphic invitation-text card.
    // "archIslamic" swaps the plain glass card for a pointed-arch bordered
    // card with patterned side pillars, an Arabic Bismillah calligraphy
    // line, and "son of"/"daughter of" parent-name lines built from
    // FamilyName1/FamilyName2. Null/"default" keeps the original card.
    public string? InvitationCardStyle { get; set; }

    // EnvelopeStyle == "customPhoto" — this template uses an admin-managed
    // Envelope (see Models/Entities/Envelope.cs) instead of one of the
    // hand-built drawn styles above, so a new envelope photo can be added
    // and assigned from the admin panel alone, with no code change. Many
    // templates can point at the same Envelope (SetNull on delete, same
    // reasoning as Invitation.Template below — deleting a still-assigned
    // envelope shouldn't take its templates down with it).
    public Guid? EnvelopeId { get; set; }
    public Envelope? Envelope { get; set; }

    // Lets an admin hide a template from the public catalog/Studio picker
    // without deleting it outright (deleting would orphan any invitation
    // already built on it, since Invitation.Template is SetNull-on-delete).
    // Defaults true so every existing seeded template stays visible after
    // this column is added.
    public bool IsActive { get; set; } = true;

    public ICollection<Invitation> Invitations { get; set; } = new List<Invitation>();
}
