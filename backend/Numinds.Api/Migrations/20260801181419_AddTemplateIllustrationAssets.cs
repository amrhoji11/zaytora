using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Numinds.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddTemplateIllustrationAssets : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DecorationImageUrl",
                table: "Templates",
                type: "TEXT",
                maxLength: 1024,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "HeroIllustrationUrl",
                table: "Templates",
                type: "TEXT",
                maxLength: 1024,
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000001"),
                columns: new[] { "DecorationImageUrl", "HeroIllustrationUrl" },
                values: new object[] { null, "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800&q=80" });

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000002"),
                columns: new[] { "DecorationImageUrl", "HeroIllustrationUrl" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000003"),
                columns: new[] { "DecorationImageUrl", "HeroIllustrationUrl" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000004"),
                columns: new[] { "DecorationImageUrl", "HeroIllustrationUrl" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000005"),
                columns: new[] { "DecorationImageUrl", "HeroIllustrationUrl" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000006"),
                columns: new[] { "DecorationImageUrl", "HeroIllustrationUrl" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000007"),
                columns: new[] { "DecorationImageUrl", "HeroIllustrationUrl" },
                values: new object[] { null, null });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DecorationImageUrl",
                table: "Templates");

            migrationBuilder.DropColumn(
                name: "HeroIllustrationUrl",
                table: "Templates");
        }
    }
}
