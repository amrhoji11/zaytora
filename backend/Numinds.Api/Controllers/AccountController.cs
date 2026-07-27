using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Numinds.Api.Models.Dtos;
using Numinds.Api.Models.Entities;

namespace Numinds.Api.Controllers;

[ApiController]
[Route("api/account")]
public class AccountController(
    SignInManager<ApplicationUser> signInManager,
    UserManager<ApplicationUser> userManager) : ControllerBase
{
    // GET /api/account/me
    [HttpGet("me")]
    [Authorize]
    public async Task<ActionResult<UserDto>> Me()
    {
        var user = await userManager.GetUserAsync(User);
        if (user is null)
        {
            return Unauthorized();
        }

        return Ok(new UserDto
        {
            Id = user.Id.ToString(),
            DisplayName = user.DisplayName,
            Email = user.Email ?? string.Empty,
            AvatarUrl = user.AvatarUrl,
        });
    }

    // POST /api/account/login
    // Not part of the original frontend spec — the account cookie session
    // has to come from somewhere for /me and /logout to be testable before
    // a real sign-in screen exists. Seeded demo user: see SeedIdentity.
    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login(LoginRequest request)
    {
        var user = await userManager.FindByEmailAsync(request.Email);
        if (user is null)
        {
            return Unauthorized(new { title = "Invalid email or password." });
        }

        var result = await signInManager.PasswordSignInAsync(
            user, request.Password, isPersistent: true, lockoutOnFailure: false);

        if (!result.Succeeded)
        {
            return Unauthorized(new { title = "Invalid email or password." });
        }

        return Ok(new UserDto
        {
            Id = user.Id.ToString(),
            DisplayName = user.DisplayName,
            Email = user.Email ?? string.Empty,
            AvatarUrl = user.AvatarUrl,
        });
    }

    // POST /api/account/logout
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        await signInManager.SignOutAsync();
        return NoContent();
    }

    // DELETE /api/account
    [HttpDelete]
    [Authorize]
    public async Task<IActionResult> DeleteAccount()
    {
        var user = await userManager.GetUserAsync(User);
        if (user is null)
        {
            return Unauthorized();
        }

        await signInManager.SignOutAsync();

        var result = await userManager.DeleteAsync(user);
        if (!result.Succeeded)
        {
            return Problem("Failed to delete account.");
        }

        return NoContent();
    }
}
