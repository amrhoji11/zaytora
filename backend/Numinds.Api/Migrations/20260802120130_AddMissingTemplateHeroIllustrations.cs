using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Numinds.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddMissingTemplateHeroIllustrations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000002"),
                column: "HeroIllustrationUrl",
                value: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80");

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000003"),
                column: "HeroIllustrationUrl",
                value: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800&q=80");

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000004"),
                column: "HeroIllustrationUrl",
                value: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800&q=80");

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000007"),
                column: "HeroIllustrationUrl",
                value: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000002"),
                column: "HeroIllustrationUrl",
                value: null);

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000003"),
                column: "HeroIllustrationUrl",
                value: null);

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000004"),
                column: "HeroIllustrationUrl",
                value: null);

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000007"),
                column: "HeroIllustrationUrl",
                value: null);
        }
    }
}
