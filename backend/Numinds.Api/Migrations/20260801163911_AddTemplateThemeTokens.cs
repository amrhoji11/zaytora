using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Numinds.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddTemplateThemeTokens : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CardBg",
                table: "Templates",
                type: "TEXT",
                maxLength: 32,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PageBg",
                table: "Templates",
                type: "TEXT",
                maxLength: 32,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PrimaryAccent",
                table: "Templates",
                type: "TEXT",
                maxLength: 32,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TextColor",
                table: "Templates",
                type: "TEXT",
                maxLength: 32,
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000001"),
                columns: new[] { "CardBg", "PageBg", "PrimaryAccent", "TextColor" },
                values: new object[] { null, null, null, null });

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000002"),
                columns: new[] { "CardBg", "PageBg", "PrimaryAccent", "TextColor" },
                values: new object[] { null, null, null, null });

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000003"),
                columns: new[] { "CardBg", "PageBg", "PrimaryAccent", "TextColor" },
                values: new object[] { null, null, null, null });

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000004"),
                columns: new[] { "CardBg", "PageBg", "PrimaryAccent", "TextColor" },
                values: new object[] { null, null, null, null });

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000005"),
                columns: new[] { "CardBg", "PageBg", "PrimaryAccent", "TextColor" },
                values: new object[] { "#0f2419", "#0b1f16,#16291e", "#8FBF9F", "#DCEBD9" });

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000006"),
                columns: new[] { "CardBg", "PageBg", "PrimaryAccent", "TextColor" },
                values: new object[] { "#fffaf2", "#fbf3e7,#fff9f0", "#b8823c", "#4a3520" });

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000007"),
                columns: new[] { "CardBg", "PageBg", "PrimaryAccent", "TextColor" },
                values: new object[] { "#fff5f7", "#fdf2f4,#fffbfc", "#c9748a", "#6b2f3a" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CardBg",
                table: "Templates");

            migrationBuilder.DropColumn(
                name: "PageBg",
                table: "Templates");

            migrationBuilder.DropColumn(
                name: "PrimaryAccent",
                table: "Templates");

            migrationBuilder.DropColumn(
                name: "TextColor",
                table: "Templates");
        }
    }
}
