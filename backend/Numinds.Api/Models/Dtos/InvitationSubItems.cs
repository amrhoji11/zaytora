namespace Numinds.Api.Models.Dtos;

// Shapes stored (as JSON) inside Invitation's *Json columns and returned
// inline on InvitationDetailDto. Kept small and flat — no separate tables,
// since guests never query into these independently.

public class VenueItemDto
{
    public string Name { get; set; } = string.Empty;
    public string? Address { get; set; }
    public string? MapUrl { get; set; }
}

public class ProgramItemDto
{
    public string? Time { get; set; }
    public string Title { get; set; } = string.Empty;
}

public class ContactItemDto
{
    public string Name { get; set; } = string.Empty;
    public string? Role { get; set; }
    public string Phone { get; set; } = string.Empty;
}
