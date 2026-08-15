using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Numinds.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddContactSettings : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ContactSettings",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Email = table.Column<string>(type: "TEXT", maxLength: 256, nullable: false),
                    SecondaryEmail = table.Column<string>(type: "TEXT", maxLength: 256, nullable: true),
                    ResponseTimeText = table.Column<string>(type: "TEXT", maxLength: 32, nullable: false),
                    AvailabilityText = table.Column<string>(type: "TEXT", maxLength: 32, nullable: false),
                    AvailableWorldwide = table.Column<bool>(type: "INTEGER", nullable: false),
                    InstagramUrl = table.Column<string>(type: "TEXT", maxLength: 512, nullable: true),
                    TikTokUrl = table.Column<string>(type: "TEXT", maxLength: 512, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ContactSettings", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ContactWhatsAppNumbers",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    ContactSettingsId = table.Column<Guid>(type: "TEXT", nullable: false),
                    CountryCode = table.Column<string>(type: "TEXT", maxLength: 4, nullable: false),
                    PhoneNumber = table.Column<string>(type: "TEXT", maxLength: 32, nullable: false),
                    SortOrder = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ContactWhatsAppNumbers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ContactWhatsAppNumbers_ContactSettings_ContactSettingsId",
                        column: x => x.ContactSettingsId,
                        principalTable: "ContactSettings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "ContactSettings",
                columns: new[] { "Id", "AvailabilityText", "AvailableWorldwide", "Email", "InstagramUrl", "ResponseTimeText", "SecondaryEmail", "TikTokUrl" },
                values: new object[] { new Guid("11111111-1111-1111-1111-111111111111"), "7/24", true, "support@numinds.me", null, "1H", "numindsdesign@gmail.com", null });

            migrationBuilder.InsertData(
                table: "ContactWhatsAppNumbers",
                columns: new[] { "Id", "ContactSettingsId", "CountryCode", "PhoneNumber", "SortOrder" },
                values: new object[,]
                {
                    { new Guid("22222222-2222-2222-2222-222222222222"), new Guid("11111111-1111-1111-1111-111111111111"), "SA", "+966 55 123 4567", 0 },
                    { new Guid("33333333-3333-3333-3333-333333333333"), new Guid("11111111-1111-1111-1111-111111111111"), "GB", "+44 7911 123456", 1 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_ContactWhatsAppNumbers_ContactSettingsId",
                table: "ContactWhatsAppNumbers",
                column: "ContactSettingsId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ContactWhatsAppNumbers");

            migrationBuilder.DropTable(
                name: "ContactSettings");
        }
    }
}
