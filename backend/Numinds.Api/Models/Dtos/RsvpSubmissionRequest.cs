namespace Numinds.Api.Models.Dtos;

// Body for POST /api/invitations/{id}/rsvp — submitted by a guest from
// InteractiveRSVPModal.tsx, not the invitation's owner.
public class RsvpSubmissionRequest
{
    public string GuestName { get; set; } = string.Empty;
    public bool? Attending { get; set; }
    public int? GuestCount { get; set; }
    public string? Message { get; set; }
}
