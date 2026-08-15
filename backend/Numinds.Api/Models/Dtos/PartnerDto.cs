namespace Numinds.Api.Models.Dtos;

// Full shape — admin's /admin/partners table. Mirrors src/types/admin.ts -> PartnerRequest.
public class PartnerDto
{
    public string Id { get; set; } = string.Empty;
    public string BusinessName { get; set; } = string.Empty;
    public string ApplicantName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public string CountryFlag { get; set; } = string.Empty;
    public string Whatsapp { get; set; } = string.Empty;
    public string? Tagline { get; set; }
    public string? InstagramUrl { get; set; }
    public string? TikTokUrl { get; set; }
    public string? FacebookUrl { get; set; }
    public string? WebsiteUrl { get; set; }
    public string? LogoUrl { get; set; }
    public string Status { get; set; } = "pending";
    public bool Active { get; set; }
    public string? PromoCode { get; set; }
    public int UsageCount { get; set; }
    public decimal RevenueUsd { get; set; }
    public string? DiscountType { get; set; }
    public decimal? DiscountValue { get; set; }
    public DateTime SubmittedAt { get; set; }
    public DateTime? ApprovedAt { get; set; }
}

// Public shape — /OurPartners. Mirrors src/types/partners.ts -> Partner.
// Includes contact/social fields (unlike the admin-only email) so visitors
// can actually reach an approved partner from the public card.
public class ApprovedPartnerDto
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public string CountryFlag { get; set; } = string.Empty;
    public string? Tagline { get; set; }
    public string Whatsapp { get; set; } = string.Empty;
    public string? InstagramUrl { get; set; }
    public string? TikTokUrl { get; set; }
    public string? FacebookUrl { get; set; }
    public string? WebsiteUrl { get; set; }
    public string? LogoUrl { get; set; }
}

// POST /api/partners — public application submission.
public class PartnerApplicationRequest
{
    public string BusinessName { get; set; } = string.Empty;
    public string ApplicantName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public string CountryFlag { get; set; } = string.Empty;
    public string Whatsapp { get; set; } = string.Empty;
    public string? Tagline { get; set; }
    public string? InstagramUrl { get; set; }
    public string? TikTokUrl { get; set; }
    public string? FacebookUrl { get; set; }
    public string? WebsiteUrl { get; set; }
    public string? LogoUrl { get; set; }
}

public class SetPartnerActiveRequest
{
    public bool Active { get; set; }
}

// PUT /api/partners/me — the logged-in partner editing their own profile.
// Deliberately excludes Category, Email, Status, Active, PromoCode, and
// Discount* — those stay admin/system-controlled (see PartnersController.UpdateMyProfile).
public class UpdateMyPartnerProfileRequest
{
    public string BusinessName { get; set; } = string.Empty;
    public string Whatsapp { get; set; } = string.Empty;
    public string? Tagline { get; set; }
    public string? InstagramUrl { get; set; }
    public string? TikTokUrl { get; set; }
    public string? FacebookUrl { get; set; }
    public string? WebsiteUrl { get; set; }
    public string? LogoUrl { get; set; }
}

public class UpdatePartnerDiscountRequest
{
    public string DiscountType { get; set; } = "percent";
    public decimal DiscountValue { get; set; }
    public string? PromoCode { get; set; }
}

// POST /api/partners/logo response.
public class PartnerLogoUploadResponse
{
    public string Url { get; set; } = string.Empty;
}
