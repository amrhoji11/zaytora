using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Numinds.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddRealBackgroundPhotosForOverlayTemplates : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000001"),
                columns: new[] { "BackgroundImageUrl", "Layout" },
                values: new object[] { "https://images.unsplash.com/photo-1673026190548-c95adc90ef60?w=1200&q=80", "full-bleed" });

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000002"),
                columns: new[] { "BackgroundImageUrl", "Layout" },
                values: new object[] { "https://images.unsplash.com/photo-1762621175799-5fc1e336e84a?w=1200&q=80", "full-bleed" });

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000003"),
                columns: new[] { "BackgroundImageUrl", "Layout" },
                values: new object[] { "https://images.unsplash.com/photo-1526353043579-c836f1c675ad?w=1200&q=80", "full-bleed" });

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000004"),
                columns: new[] { "BackgroundImageUrl", "Layout" },
                values: new object[] { "https://images.unsplash.com/photo-1584032910793-7aa893dbefda?w=1200&q=80", "full-bleed" });

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000007"),
                columns: new[] { "BackgroundImageUrl", "Layout" },
                values: new object[] { "https://images.unsplash.com/photo-1778186414142-7e4100e9f17d?w=1200&q=80", "full-bleed" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000001"),
                columns: new[] { "BackgroundImageUrl", "Layout" },
                values: new object[] { null, "overlay" });

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000002"),
                columns: new[] { "BackgroundImageUrl", "Layout" },
                values: new object[] { null, "overlay" });

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000003"),
                columns: new[] { "BackgroundImageUrl", "Layout" },
                values: new object[] { null, "overlay" });

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000004"),
                columns: new[] { "BackgroundImageUrl", "Layout" },
                values: new object[] { null, "overlay" });

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000007"),
                columns: new[] { "BackgroundImageUrl", "Layout" },
                values: new object[] { null, "overlay" });
        }
    }
}
