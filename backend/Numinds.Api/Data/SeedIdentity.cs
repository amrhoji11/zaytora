using Microsoft.AspNetCore.Identity;
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

        if (await userManager.FindByEmailAsync(DemoEmail) is not null)
        {
            return;
        }

        var demoUser = new ApplicationUser
        {
            Id = Guid.Parse("8f14e45f-ceea-467e-adb2-0000000000f0"),
            UserName = DemoEmail,
            Email = DemoEmail,
            EmailConfirmed = true,
            DisplayName = "Demo Account",
        };

        var result = await userManager.CreateAsync(demoUser, DemoPassword);
        if (!result.Succeeded)
        {
            var errors = string.Join("; ", result.Errors.Select(e => e.Description));
            throw new InvalidOperationException($"Failed to seed demo user: {errors}");
        }
    }
}
