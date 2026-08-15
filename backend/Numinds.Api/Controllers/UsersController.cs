using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Numinds.Api.Data;
using Numinds.Api.Models;
using Numinds.Api.Models.Dtos;
using Numinds.Api.Models.Entities;

namespace Numinds.Api.Controllers;

[ApiController]
[Route("api/users")]
[Authorize(Roles = Roles.Admin)]
public class UsersController(
    NumindsDbContext db,
    UserManager<ApplicationUser> userManager,
    RoleManager<IdentityRole<Guid>> roleManager) : ControllerBase
{
    // GET /api/users — admin, for a new /admin/users page. `search` matches
    // DisplayName/Email/UserName (AspNetUsers.NormalizedEmail already carries
    // Identity's own unique index, so this stays fast without an extra one);
    // paginated since the user base only grows.
    [HttpGet]
    public async Task<ActionResult<PagedResult<UserDto>>> List(
        [FromQuery] string? search,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken cancellationToken = default)
    {
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 500);

        var query = db.Users.AsNoTracking().AsQueryable();
        var term = search?.Trim();
        if (!string.IsNullOrEmpty(term))
        {
            query = query.Where(u =>
                u.DisplayName.Contains(term) ||
                (u.Email != null && u.Email.Contains(term)));
        }

        var totalCount = await query.CountAsync(cancellationToken);
        var users = await query
            .OrderBy(u => u.DisplayName)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        // One extra query for the current page's admin flags, rather than
        // N IsInRoleAsync calls — GetUsersInRoleAsync doesn't take an id
        // filter, so intersecting with the current page's ids client-side
        // is the cheapest option since Admin rows are always few.
        var adminIds = (await userManager.GetUsersInRoleAsync(Roles.Admin))
            .Select(u => u.Id)
            .ToHashSet();

        return Ok(new PagedResult<UserDto>
        {
            Items = users.Select(u => ToDto(u, adminIds.Contains(u.Id))).ToList(),
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize,
        });
    }

    // PATCH /api/users/{id}/role — Role: "Admin" to promote, null to demote.
    // An admin can't demote themselves (would leave them locked out of
    // /admin mid-session with no other admin necessarily available to undo it).
    [HttpPatch("{id:guid}/role")]
    public async Task<ActionResult<UserDto>> ChangeRole(Guid id, ChangeUserRoleRequest request, CancellationToken cancellationToken)
    {
        if (request.Role is not (null or Roles.Admin))
        {
            return BadRequest(new { title = $"Unsupported role '{request.Role}'." });
        }

        var user = await userManager.FindByIdAsync(id.ToString());
        if (user is null)
        {
            return NotFound();
        }

        var currentUserId = userManager.GetUserId(User);
        if (request.Role is null && string.Equals(currentUserId, id.ToString(), StringComparison.OrdinalIgnoreCase))
        {
            return BadRequest(new { title = "You can't remove your own admin role." });
        }

        if (!await roleManager.RoleExistsAsync(Roles.Admin))
        {
            await roleManager.CreateAsync(new IdentityRole<Guid>(Roles.Admin));
        }

        var isAdmin = await userManager.IsInRoleAsync(user, Roles.Admin);
        if (request.Role == Roles.Admin && !isAdmin)
        {
            await userManager.AddToRoleAsync(user, Roles.Admin);
            isAdmin = true;
        }
        else if (request.Role is null && isAdmin)
        {
            await userManager.RemoveFromRoleAsync(user, Roles.Admin);
            isAdmin = false;
        }

        return Ok(ToDto(user, isAdmin));
    }

    private static UserDto ToDto(ApplicationUser u, bool isAdmin) => new()
    {
        Id = u.Id.ToString(),
        DisplayName = u.DisplayName,
        Email = u.Email ?? string.Empty,
        AvatarUrl = u.AvatarUrl,
        PhoneNumber = u.PhoneNumber,
        IsAdmin = isAdmin,
    };
}
