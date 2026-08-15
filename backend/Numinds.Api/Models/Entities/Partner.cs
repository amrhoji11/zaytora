namespace Numinds.Api.Models.Entities;

// A partner application, from first submission through admin moderation.
// One row covers the whole lifecycle (Status: pending -> approved/rejected)
// rather than separate "request" and "partner" tables, since nothing about
// an application changes shape once approved — it just gains a PromoCode
// and starts accruing UsageCount/RevenueUsd.
public class Partner
{
    public Guid Id { get; set; }

    // Set from the authenticated applicant on Apply — see
    // PartnersController.GetCurrentUserIdAsync. Null only for the handful of
    // legacy rows created before applications required an account; those
    // stay admin-managed since there's no owning login to attach self-service
    // edit access to.
    public Guid? UserId { get; set; }

    public string BusinessName { get; set; } = string.Empty;
    public string ApplicantName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty; // eventPlanner | photographer | designer | other
    public string Country { get; set; } = string.Empty;
    public string CountryFlag { get; set; } = string.Empty;
    public string Whatsapp { get; set; } = string.Empty;
    public string? Tagline { get; set; }
    public string? InstagramUrl { get; set; }
    public string? TikTokUrl { get; set; }
    public string? FacebookUrl { get; set; }
    public string? WebsiteUrl { get; set; }
    public string? LogoUrl { get; set; }

    public string Status { get; set; } = "pending"; // pending | approved | rejected
    public bool Active { get; set; } = true;

    // Set once, on approval — see PartnersController.Approve.
    public string? PromoCode { get; set; }
    public int UsageCount { get; set; }
    public decimal RevenueUsd { get; set; }
    public string? DiscountType { get; set; }
    public decimal? DiscountValue { get; set; }

    public DateTime SubmittedAt { get; set; }
    public DateTime? ApprovedAt { get; set; }
}
