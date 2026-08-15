namespace Numinds.Api.Models.Entities;

// Singleton row (exactly one, seeded — see NumindsDbContext.OnModelCreating)
// backing the public /contact-us page and its admin edit form
// (/admin/settings). Every field here is something the admin can change
// without a code deploy — the page itself only ever renders whatever this
// row currently holds.
public class ContactSettings
{
    public Guid Id { get; set; }

    // Shown both as the left-column channel-list entry and in the right
    // panel's contact list.
    public string Email { get; set; } = string.Empty;

    // Shown only in the right panel's contact list — null hides that row
    // entirely rather than rendering an empty one.
    public string? SecondaryEmail { get; set; }

    // Free text, not a numeric duration — the reference design's "1H" isn't
    // "1 hour" spelled out, so admins may want other short strings ("<1H",
    // "30m") without a code change.
    public string ResponseTimeText { get; set; } = "1H";

    // Same free-text reasoning as ResponseTimeText — "7/24" in the reference
    // design, not "24/7".
    public string AvailabilityText { get; set; } = "7/24";

    public bool AvailableWorldwide { get; set; } = true;

    // Social links for the "تابعنا" row — null hides that icon rather than
    // linking to a dead/placeholder URL.
    public string? InstagramUrl { get; set; }
    public string? TikTokUrl { get; set; }

    public ICollection<ContactWhatsAppNumber> WhatsAppNumbers { get; set; } = new List<ContactWhatsAppNumber>();
}
