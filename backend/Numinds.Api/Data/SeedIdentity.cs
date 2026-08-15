using Microsoft.AspNetCore.Identity;
using Numinds.Api.Models;
using Numinds.Api.Models.Entities;

namespace Numinds.Api.Data;

// Identity users need their password hashed via UserManager, so unlike the
// templates this can't be done through migration HasData — it runs once at
// startup instead. Lets /account/me, /account/logout, and DELETE /account
// be exercised end-to-end (e.g. via Swagger) before a real sign-up flow
// exists on the frontend.
public static class SeedIdentity
{
    public const string DemoEmail = "demo@numinds.me";
    public const string DemoPassword = "Passw0rd!23";

    public static async Task RunAsync(IServiceProvider services)
    {
        var userManager = services.GetRequiredService<UserManager<ApplicationUser>>();

        var existing = await userManager.FindByEmailAsync(DemoEmail);
        if (existing is not null)
        {
            // Already seeded by an earlier run — still backfill any fields
            // added since then (e.g. PhoneNumber) instead of leaving them
            // null forever on dev databases created before this existed.
            if (existing.PhoneNumber is null)
            {
                existing.PhoneNumber = "+966500000000";
                existing.PhoneNumberConfirmed = true;
                await userManager.UpdateAsync(existing);
            }
            return;
        }

        var demoUser = new ApplicationUser
        {
            Id = Guid.Parse("8f14e45f-ceea-467e-adb2-0000000000f0"),
            UserName = DemoEmail,
            Email = DemoEmail,
            EmailConfirmed = true,
            DisplayName = "Demo Account",
            PhoneNumber = "+966500000000",
            PhoneNumberConfirmed = true,
        };

        var result = await userManager.CreateAsync(demoUser, DemoPassword);
        if (!result.Succeeded)
        {
            var errors = string.Join("; ", result.Errors.Select(e => e.Description));
            throw new InvalidOperationException($"Failed to seed demo user: {errors}");
        }
    }

    // Grants the Admin role to every email listed under Admin:SeedEmails in
    // config (appsettings — see appsettings.Development.json). Runs on every
    // startup, not just first-run: safe/idempotent (IsInRoleAsync guards the
    // add), and it's what lets a freshly-registered account matching one of
    // those emails become admin after the next restart, without ever needing
    // an in-app "manage admins" UI. Accounts not yet registered are simply
    // skipped — nothing to promote until they sign up.
    public static async Task RunAdminRoleSeedAsync(IServiceProvider services)
    {
        var configuration = services.GetRequiredService<IConfiguration>();
        var seedEmails = configuration.GetSection("Admin:SeedEmails").Get<string[]>() ?? [];
        if (seedEmails.Length == 0) return;

        var roleManager = services.GetRequiredService<RoleManager<IdentityRole<Guid>>>();
        if (!await roleManager.RoleExistsAsync(Roles.Admin))
        {
            await roleManager.CreateAsync(new IdentityRole<Guid>(Roles.Admin));
        }

        var userManager = services.GetRequiredService<UserManager<ApplicationUser>>();
        foreach (var email in seedEmails)
        {
            var user = await userManager.FindByEmailAsync(email);
            if (user is null) continue;

            if (!await userManager.IsInRoleAsync(user, Roles.Admin))
            {
                await userManager.AddToRoleAsync(user, Roles.Admin);
            }
        }
    }
}
