namespace Numinds.Api.Models.Entities;

// A single guest's RSVP submission against one invitation — what
// InteractiveRSVPModal.tsx posts on the guest-facing invitation page.
// Powers the "Responses" count on the owner's dashboard.
public class RsvpResponse
{
    public Guid Id { get; set; }
    public Guid InvitationId { get; set; }
    public Invitation? Invitation { get; set; }

    public string GuestName { get; set; } = string.Empty;
    public bool? Attending { get; set; }
    public int? GuestCount { get; set; }
    public string? Message { get; set; }
    public DateTime CreatedAt { get; set; }
}
