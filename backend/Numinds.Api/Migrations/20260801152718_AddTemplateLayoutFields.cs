using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Numinds.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddTemplateLayoutFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "BackgroundImageUrl",
                table: "Templates",
                type: "TEXT",
                maxLength: 1024,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Layout",
                table: "Templates",
                type: "TEXT",
                maxLength: 32,
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000001"),
                columns: new[] { "BackgroundImageUrl", "Layout" },
                values: new object[] { null, "none" });

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000002"),
                columns: new[] { "BackgroundImageUrl", "Layout" },
                values: new object[] { null, "none" });

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000003"),
                columns: new[] { "BackgroundImageUrl", "Layout" },
                values: new object[] { null, "none" });

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000004"),
                columns: new[] { "BackgroundImageUrl", "Layout" },
                values: new object[] { null, "none" });

            migrationBuilder.InsertData(
                table: "Templates",
                columns: new[] { "Id", "BackgroundImageUrl", "Category", "Code", "ImageUrl", "IsPopular", "Layout" },
                values: new object[,]
                {
                    { new Guid("8f14e45f-ceea-467e-adb2-000000000005"), "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=1200&q=80", "wedding", "W101", "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800&q=80", true, "full-bleed" },
                    { new Guid("8f14e45f-ceea-467e-adb2-000000000006"), "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80", "wedding", "W102", "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80", false, "boxed-hero" },
                    { new Guid("8f14e45f-ceea-467e-adb2-000000000007"), null, "wedding", "W103", "/images/templates/w029.png", false, "overlay" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000005"));

            migrationBuilder.DeleteData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000006"));

            migrationBuilder.DeleteData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000007"));

            migrationBuilder.DropColumn(
                name: "BackgroundImageUrl",
                table: "Templates");

            migrationBuilder.DropColumn(
                name: "Layout",
                table: "Templates");
        }
    }
}
