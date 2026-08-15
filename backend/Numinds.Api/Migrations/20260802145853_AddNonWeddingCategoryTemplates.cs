using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Numinds.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddNonWeddingCategoryTemplates : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Templates",
                columns: new[] { "Id", "AmbientEffect", "BackgroundImageUrl", "CardBg", "Category", "Code", "DecorationImageUrl", "DefaultNamesFont", "HeroIllustrationUrl", "ImageUrl", "IsPopular", "Layout", "PageBg", "PrimaryAccent", "TextColor" },
                values: new object[,]
                {
                    { new Guid("8f14e45f-ceea-467e-adb2-000000000008"), "sparkle", "https://images.unsplash.com/photo-1686538246844-f3ca82434d95?w=1200&q=80", "#fbeee0", "engagement", "E001", null, null, null, "https://images.unsplash.com/photo-1686538246844-f3ca82434d95?w=800&q=80", true, "full-bleed", "#fdf3ea,#fffaf5", "#c9945a", "#7a4a35" },
                    { new Guid("8f14e45f-ceea-467e-adb2-000000000009"), "sparkle", "https://images.unsplash.com/photo-1639078007551-b14a57d62c8d?w=1200&q=80", "#f7f4ef", "engagement", "E002", null, null, null, "https://images.unsplash.com/photo-1639078007551-b14a57d62c8d?w=800&q=80", false, "full-bleed", "#f3efe9,#fdfdfb", "#a89a86", "#5a5652" },
                    { new Guid("8f14e45f-ceea-467e-adb2-00000000000a"), "sparkle", "https://images.unsplash.com/photo-1596911942922-521ec0db907d?w=1200&q=80", "#f7efd9", "marriage_contract", "Q001", null, "font-cinzel", null, "https://images.unsplash.com/photo-1596911942922-521ec0db907d?w=800&q=80", true, "full-bleed", "#faf5e8,#fffdf7", "#b8963c", "#5c4a1f" },
                    { new Guid("8f14e45f-ceea-467e-adb2-00000000000b"), "smoke", "https://images.unsplash.com/photo-1730376475964-0e196eb95a6e?w=1200&q=80", "#16203a", "marriage_contract", "Q002", null, "font-cinzel", null, "https://images.unsplash.com/photo-1730376475964-0e196eb95a6e?w=800&q=80", false, "full-bleed", "#111a2e,#1c2740", "#c9a13c", "#e8d9a8" },
                    { new Guid("8f14e45f-ceea-467e-adb2-00000000000c"), "petals", "https://images.unsplash.com/photo-1771992230505-97e0c3d38213?w=1200&q=80", "#fde2c8", "henna", "H001", null, null, null, "https://images.unsplash.com/photo-1771992230505-97e0c3d38213?w=800&q=80", true, "full-bleed", "#fdece0,#fff8f0", "#d9741f", "#7a3a1a" },
                    { new Guid("8f14e45f-ceea-467e-adb2-00000000000d"), "petals", "https://images.unsplash.com/photo-1771992228898-79342c9c1c39?w=1200&q=80", "#fbd9c4", "henna", "H002", null, null, null, "https://images.unsplash.com/photo-1771992228898-79342c9c1c39?w=800&q=80", false, "full-bleed", "#fbe4d8,#fff6f0", "#c0392b", "#6b2a1a" },
                    { new Guid("8f14e45f-ceea-467e-adb2-00000000000e"), "sparkle", "https://images.unsplash.com/photo-1727178757622-26389a0538f5?w=1200&q=80", "#fbe4e8", "bridal_shower", "S001", null, null, null, "https://images.unsplash.com/photo-1727178757622-26389a0538f5?w=800&q=80", true, "full-bleed", "#fdf1f3,#fffbfc", "#d88a9e", "#8a3f52" },
                    { new Guid("8f14e45f-ceea-467e-adb2-00000000000f"), "petals", "https://images.unsplash.com/photo-1581022295432-7fabcc628434?w=1200&q=80", "#f9dee6", "bridal_shower", "S002", null, null, null, "https://images.unsplash.com/photo-1581022295432-7fabcc628434?w=800&q=80", false, "full-bleed", "#fbeaf0,#fff8fa", "#e0a0b8", "#7a3f52" },
                    { new Guid("8f14e45f-ceea-467e-adb2-000000000010"), "sparkle", "https://images.unsplash.com/photo-1768776181652-d640d88a75f0?w=1200&q=80", "#e8e5f5", "gender_reveal", "R001", null, null, null, "https://images.unsplash.com/photo-1768776181652-d640d88a75f0?w=800&q=80", true, "full-bleed", "#f0eef7,#fbfaff", "#9b8fc9", "#4a4568" },
                    { new Guid("8f14e45f-ceea-467e-adb2-000000000011"), "sparkle", "https://images.unsplash.com/photo-1560128411-79892dd93bf8?w=1200&q=80", "#dcebfa", "gender_reveal", "R002", null, null, null, "https://images.unsplash.com/photo-1560128411-79892dd93bf8?w=800&q=80", false, "full-bleed", "#eaf2fb,#f8fbff", "#7fa8d9", "#2f4a68" },
                    { new Guid("8f14e45f-ceea-467e-adb2-000000000012"), "sparkle", "https://images.unsplash.com/photo-1704649917979-9a23d585da95?w=1200&q=80", "#f5eee0", "aqeeqah", "A001", null, null, null, "https://images.unsplash.com/photo-1704649917979-9a23d585da95?w=800&q=80", true, "full-bleed", "#faf6ee,#fffdf8", "#c9b183", "#6b5a3f" },
                    { new Guid("8f14e45f-ceea-467e-adb2-000000000013"), "petals", "https://images.unsplash.com/photo-1741840800730-785888bd32c2?w=1200&q=80", "#f7dee2", "aqeeqah", "A002", null, null, null, "https://images.unsplash.com/photo-1741840800730-785888bd32c2?w=800&q=80", false, "full-bleed", "#fbeef0,#fff9fa", "#d98fa0", "#7a4a52" },
                    { new Guid("8f14e45f-ceea-467e-adb2-000000000014"), "sparkle", "https://images.unsplash.com/photo-1636231945376-3d40fdcbc462?w=1200&q=80", "#13291f", "graduation", "G001", null, null, null, "https://images.unsplash.com/photo-1636231945376-3d40fdcbc462?w=800&q=80", true, "full-bleed", "#0f1f18,#182e24", "#5fae7f", "#dcece0" },
                    { new Guid("8f14e45f-ceea-467e-adb2-000000000015"), "sparkle", "https://images.unsplash.com/photo-1785052335573-8c0bcd811c5b?w=1200&q=80", "#f7ecc4", "graduation", "G002", null, null, null, "https://images.unsplash.com/photo-1785052335573-8c0bcd811c5b?w=800&q=80", false, "full-bleed", "#fdf6e3,#fffcf0", "#c9a227", "#6b5518" },
                    { new Guid("8f14e45f-ceea-467e-adb2-000000000016"), "sparkle", "https://images.unsplash.com/photo-1762918988304-97d4a5840a4a?w=1200&q=80", "#f7ead0", "birthday", "B001", null, null, null, "https://images.unsplash.com/photo-1762918988304-97d4a5840a4a?w=800&q=80", true, "full-bleed", "#fbf3e6,#fffcf5", "#c9a13c", "#6b5220" },
                    { new Guid("8f14e45f-ceea-467e-adb2-000000000017"), "sparkle", "https://images.unsplash.com/photo-1780586382191-bef9c740798e?w=1200&q=80", "#dff0e3", "birthday", "B002", null, null, null, "https://images.unsplash.com/photo-1780586382191-bef9c740798e?w=800&q=80", false, "full-bleed", "#eef7f0,#fbfffb", "#7fbf95", "#2f5240" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000008"));

            migrationBuilder.DeleteData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000009"));

            migrationBuilder.DeleteData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-00000000000a"));

            migrationBuilder.DeleteData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-00000000000b"));

            migrationBuilder.DeleteData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-00000000000c"));

            migrationBuilder.DeleteData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-00000000000d"));

            migrationBuilder.DeleteData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-00000000000e"));

            migrationBuilder.DeleteData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-00000000000f"));

            migrationBuilder.DeleteData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000010"));

            migrationBuilder.DeleteData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000011"));

            migrationBuilder.DeleteData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000012"));

            migrationBuilder.DeleteData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000013"));

            migrationBuilder.DeleteData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000014"));

            migrationBuilder.DeleteData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000015"));

            migrationBuilder.DeleteData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000016"));

            migrationBuilder.DeleteData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000017"));
        }
    }
}
