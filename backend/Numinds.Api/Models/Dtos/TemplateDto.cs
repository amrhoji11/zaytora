namespace Numinds.Api.Models.Dtos;

// Mirrors src/types/api.ts -> TemplateDto (System.Text.Json defaults to camelCase).
public class TemplateDto
{
    public string Id { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public string? BackgroundImageUrl { get; set; }
    public string Layout { get; set; } = "none";
    public string? PageBg { get; set; }
    public string? CardBg { get; set; }
    public string? TextColor { get; set; }
    public string? PrimaryAccent { get; set; }
    public string? DefaultNamesFont { get; set; }
    public string? HeroIllustrationUrl { get; set; }
    public string? DecorationImageUrl { get; set; }
    public string? OpeningVideoUrl { get; set; }
    public string? AmbientVideoUrl { get; set; }
    public string? AmbientEffect { get; set; }
    public string? EnvelopeStyle { get; set; }
    public string? HeroFrameStyle { get; set; }
    public string? DateRevealStyle { get; set; }
    public string? InvitationCardStyle { get; set; }
    // Which Envelope (see Models/Entities/Envelope.cs) this template is
    // assigned, plus that envelope's own photo/seal position resolved
    // inline — PhotoWaxSealEnvelopeCover on the frontend renders straight
    // off these two fields without a second fetch. EnvelopeId alone is what
    // TemplateEditModal's picker needs to show which envelope is selected.
    public string? EnvelopeId { get; set; }
    public string? EnvelopePhotoUrl { get; set; }
    public double? EnvelopeSealXPercent { get; set; }
    public double? EnvelopeSealYPercent { get; set; }
    // "flap" or "scroll" — picks which cover component InvitationCanvas
    // mounts for this envelope's photo (see Envelope.OpeningStyle).
    public string? EnvelopeOpeningStyle { get; set; }
    // Only meaningful when EnvelopeOpeningStyle is "flap" — the fold lines
    // the admin traced on the envelope's own photo (empty falls back to the
    // four-symmetric-flaps model). See Envelope.FoldPointsJson.
    public List<EnvelopeFoldPoint> EnvelopeFoldPoints { get; set; } = [];
    public bool IsPopular { get; set; }
    public bool IsHomepageFeatured { get; set; }
    public bool IsActive { get; set; }
    public int UsageCount { get; set; }
}

// Payload for POST/PUT /api/templates — Id/Code/UsageCount are server-owned
// (Code is auto-generated from Category, see TemplatesController.GenerateCode).
public class TemplateWriteRequest
{
    public string Category { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public string? BackgroundImageUrl { get; set; }
    public string Layout { get; set; } = "none";
    public string? PageBg { get; set; }
    public string? CardBg { get; set; }
    public string? TextColor { get; set; }
    public string? PrimaryAccent { get; set; }
    public string? DefaultNamesFont { get; set; }
    public string? HeroIllustrationUrl { get; set; }
    public string? DecorationImageUrl { get; set; }
    public string? OpeningVideoUrl { get; set; }
    public string? AmbientVideoUrl { get; set; }
    public string? AmbientEffect { get; set; }
    public string? EnvelopeStyle { get; set; }
    public string? HeroFrameStyle { get; set; }
    public string? DateRevealStyle { get; set; }
    public string? InvitationCardStyle { get; set; }
    // Which Envelope to assign, by id — null/empty clears the assignment.
    public string? EnvelopeId { get; set; }
    public bool IsPopular { get; set; }
    public bool IsActive { get; set; } = true;
}

public class SetTemplateActiveRequest
{
    public bool IsActive { get; set; }
}

public class SetTemplateHomepageFeaturedRequest
{
    public bool IsHomepageFeatured { get; set; }
}

public class TemplateImageUploadResponse
{
    public string Url { get; set; } = string.Empty;
}

public class TemplateVideoUploadResponse
{
    public string Url { get; set; } = string.Empty;
}
