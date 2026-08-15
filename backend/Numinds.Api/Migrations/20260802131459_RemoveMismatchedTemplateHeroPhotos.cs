using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Numinds.Api.Migrations
{
    /// <inheritdoc />
    public partial class RemoveMismatchedTemplateHeroPhotos : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000001"),
                column: "HeroIllustrationUrl",
                value: null);

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000001"),
                column: "HeroIllustrationUrl",
                value: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=1200&q=80");

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000002"),
                column: "HeroIllustrationUrl",
                value: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&q=80");

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000003"),
                column: "HeroIllustrationUrl",
                value: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1200&q=80");

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000004"),
                column: "HeroIllustrationUrl",
                value: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&q=80");

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000007"),
                column: "HeroIllustrationUrl",
                value: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1200&q=80");
        }
    }
}
