namespace Numinds.Api.Models.Entities;

// A "Contact Us" form submission (ContactUsView.tsx), reviewed by an admin
// on /admin/settings — no ticket lifecycle yet (no status/replies), just an
// inbox: received, optionally marked read.
public class SupportMessage
{
    public Guid Id { get; set; }

    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;

    public DateTime ReceivedAt { get; set; }
    public bool IsRead { get; set; }
}
