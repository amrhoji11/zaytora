namespace Numinds.Api.Models.Dtos;

// Mirrors src/types/api.ts -> UserDto
public class UserDto
{
    public string Id { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; }
}
