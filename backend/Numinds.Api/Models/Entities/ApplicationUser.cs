using Microsoft.AspNetCore.Identity;

namespace Numinds.Api.Models.Entities;

public class ApplicationUser : IdentityUser<Guid>
{
    public string DisplayName { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; }
    // Property default (not a DB-level default) so every creation path --
    // Register, Google sign-in, SeedIdentity -- gets a real timestamp
    // automatically without each one having to set it explicitly. Powers
    // /admin/users' oldest-to-newest numbering (see UsersController.List).
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
