namespace Numinds.Api.Models.Dtos;

// Mirrors src/types/api.ts -> InvitationDto
public class InvitationDto
{
    public string Id { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string EditUrl { get; set; } = string.Empty;
}
