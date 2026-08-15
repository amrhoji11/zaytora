namespace Numinds.Api.Models.Dtos;

// Mirrors src/types/api.ts -> UserDto
public class UserDto
{
    public string Id { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; }
    // Backed by IdentityUser's built-in PhoneNumber column — no new migration needed.
    public string? PhoneNumber { get; set; }
    // True when the user is in the "Admin" IdentityRole — gates /admin on the frontend.
    public bool IsAdmin { get; set; }
}

// PATCH /api/users/{id}/role — Role is "Admin" to promote, or null/omitted
// to demote back to a regular user. Only one role currently exists
// (Models.Roles.Admin), so this is a binary toggle rather than a free-text
// role assignment.
public class ChangeUserRoleRequest
{
    public string? Role { get; set; }
}
