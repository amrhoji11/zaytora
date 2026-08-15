using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Numinds.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddTemplateDefaultNamesFontAndLegacyPalettes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DefaultNamesFont",
                table: "Templates",
                type: "TEXT",
                maxLength: 32,
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000001"),
                columns: new[] { "CardBg", "DefaultNamesFont", "Layout", "PageBg", "PrimaryAccent", "TextColor" },
                values: new object[] { "#fbeee5", "font-cinzel", "overlay", "#faf1ea,#fffdfa", "#8c2a3a", "#5c1a26" });

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000002"),
                columns: new[] { "CardBg", "DefaultNamesFont", "Layout", "PageBg", "PrimaryAccent", "TextColor" },
                values: new object[] { "#2b2119", "font-cinzel", "overlay", "#241d17,#332920", "#D8C4A0", "#F3E9DC" });

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000003"),
                columns: new[] { "CardBg", "DefaultNamesFont", "Layout", "PageBg", "PrimaryAccent", "TextColor" },
                values: new object[] { "#fdf3e4", "font-serif", "overlay", "#fdf6ec,#fffcf5", "#c98a5a", "#6b4a2f" });

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000004"),
                columns: new[] { "CardBg", "DefaultNamesFont", "Layout", "PageBg", "PrimaryAccent", "TextColor" },
                values: new object[] { "#ffffff", "italic font-serif", "overlay", "#ffffff,#fbfbf9", "#a68a4a", "#5a5a54" });

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000005"),
                column: "DefaultNamesFont",
                value: null);

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000006"),
                column: "DefaultNamesFont",
                value: null);

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000007"),
                column: "DefaultNamesFont",
                value: null);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DefaultNamesFont",
                table: "Templates");

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000001"),
                columns: new[] { "CardBg", "Layout", "PageBg", "PrimaryAccent", "TextColor" },
                values: new object[] { null, "none", null, null, null });

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000002"),
                columns: new[] { "CardBg", "Layout", "PageBg", "PrimaryAccent", "TextColor" },
                values: new object[] { null, "none", null, null, null });

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000003"),
                columns: new[] { "CardBg", "Layout", "PageBg", "PrimaryAccent", "TextColor" },
                values: new object[] { null, "none", null, null, null });

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000004"),
                columns: new[] { "CardBg", "Layout", "PageBg", "PrimaryAccent", "TextColor" },
                values: new object[] { null, "none", null, null, null });
        }
    }
}
