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
    // Sequential position (1, 2, 3...) among non-admin users ordered by
    // CreatedAt ascending -- only meaningful on GET /api/users (the admin
    // list); null everywhere else (account/me, register, login), and null
    // for admins there too, since they're pinned to the top unnumbered.
    public int? JoinNumber { get; set; }
}

// PATCH /api/users/{id}/role — Role is "Admin" to promote, or null/omitted
// to demote back to a regular user. Only one role currently exists
// (Models.Roles.Admin), so this is a binary toggle rather than a free-text
// role assignment.
public class ChangeUserRoleRequest
{
    public string? Role { get; set; }
}
