namespace Numinds.Api.Models.Dtos;

// Row shape for GET /api/invitations — the dashboard's bookings table.
// Deliberately thin compared to InvitationDetailDto: the list view only
// needs enough to render a table row, not the full wizard state.
public class InvitationSummaryDto
{
    public string Id { get; set; } = string.Empty;
    // Friendly display code (e.g. "ND1001") — derived from the caller's
    // invitations ordered by creation date, not a stored column.
    public string BookingId { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public bool IsPaid { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? EventDateTime { get; set; }
    public int ResponseCount { get; set; }
    public int GalleryCount { get; set; }
    public string? FirstName { get; set; }
    public string? SecondName { get; set; }
}

// GET /api/invitations/{id}/rsvp — one row per guest RSVP submission, for
// the owner's dashboard "Responses" modal (not the guest-facing wishes
// feed, which only surfaces the Message text).
public class RsvpResponseDto
{
    public string Id { get; set; } = string.Empty;
    public string GuestName { get; set; } = string.Empty;
    public bool? Attending { get; set; }
    public int? GuestCount { get; set; }
    public string? Message { get; set; }
    public DateTime CreatedAt { get; set; }
}
