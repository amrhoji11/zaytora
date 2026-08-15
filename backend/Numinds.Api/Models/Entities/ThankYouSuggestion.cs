namespace Numinds.Api.Models.Entities;

// Admin-uploaded pre-made "thank you" image cards (e.g. styled calligraphy
// like "بارك الله لكما"). Studio's Step04BasicInfo lets a user pick one of
// these instead of typing custom ThankYouText — see Invitation.ThankYouImageUrl.
public class ThankYouSuggestion
{
    public Guid Id { get; set; }
    public string Label { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
    public int SortOrder { get; set; }
    public DateTime CreatedAt { get; set; }
}
