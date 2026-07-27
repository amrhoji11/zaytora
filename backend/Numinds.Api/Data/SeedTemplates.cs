using Numinds.Api.Models.Entities;

namespace Numinds.Api.Data;

// Fixed GUIDs so `HasData` migrations stay stable across regeneration.
// ImageUrl values are root-relative paths that already exist in the
// Next.js app's public/images/templates/ folder, so the frontend can
// render them directly via next/image without needing a separate asset
// host — matches the exact demo set TemplatesGrid.tsx falls back to.
public static class SeedTemplates
{
    public static readonly Template[] All =
    [
        new Template
        {
            Id = Guid.Parse("8f14e45f-ceea-467e-adb2-000000000001"),
            Code = "W024",
            Category = "wedding",
            ImageUrl = "/images/templates/w024.png",
            IsPopular = true,
        },
        new Template
        {
            Id = Guid.Parse("8f14e45f-ceea-467e-adb2-000000000002"),
            Code = "W031",
            Category = "wedding",
            ImageUrl = "/images/templates/w031.jpeg",
            IsPopular = false,
        },
        new Template
        {
            Id = Guid.Parse("8f14e45f-ceea-467e-adb2-000000000003"),
            Code = "W029",
            Category = "wedding",
            ImageUrl = "/images/templates/w029.png",
            IsPopular = false,
        },
        new Template
        {
            Id = Guid.Parse("8f14e45f-ceea-467e-adb2-000000000004"),
            Code = "W019",
            Category = "wedding",
            ImageUrl = "/images/templates/w019.png",
            IsPopular = false,
        },
    ];
}
