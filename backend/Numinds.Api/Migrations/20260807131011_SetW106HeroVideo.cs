using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Numinds.Api.Migrations
{
    /// <inheritdoc />
    public partial class SetW106HeroVideo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000018"),
                column: "BackgroundImageUrl",
                value: "https://videos.pexels.com/video-files/33588485/14277788_1920_1080_25fps.mp4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000018"),
                column: "BackgroundImageUrl",
                value: "https://images.unsplash.com/photo-1572280075160-be1ab588d4d6?w=1200&q=80");
        }
    }
}
