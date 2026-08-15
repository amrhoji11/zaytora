using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Numinds.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddOrdersPartnersReviews : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Orders",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    InvitationId = table.Column<Guid>(type: "TEXT", nullable: false),
                    CustomerName = table.Column<string>(type: "TEXT", maxLength: 128, nullable: false),
                    CustomerEmail = table.Column<string>(type: "TEXT", maxLength: 256, nullable: false),
                    QrEnabled = table.Column<bool>(type: "INTEGER", nullable: false),
                    QrGuestCount = table.Column<int>(type: "INTEGER", nullable: true),
                    GiftFeeCoverage = table.Column<bool>(type: "INTEGER", nullable: false),
                    PromoCodeUsed = table.Column<string>(type: "TEXT", maxLength: 64, nullable: true),
                    AmountUsd = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    Currency = table.Column<string>(type: "TEXT", maxLength: 8, nullable: false),
                    ConvertedAmount = table.Column<decimal>(type: "decimal(12,2)", nullable: false),
                    PaymentStatus = table.Column<string>(type: "TEXT", maxLength: 16, nullable: false),
                    AdminNote = table.Column<string>(type: "TEXT", maxLength: 512, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    PaidAt = table.Column<DateTime>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Orders", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Orders_Invitations_InvitationId",
                        column: x => x.InvitationId,
                        principalTable: "Invitations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Partners",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    BusinessName = table.Column<string>(type: "TEXT", maxLength: 128, nullable: false),
                    ApplicantName = table.Column<string>(type: "TEXT", maxLength: 128, nullable: false),
                    Email = table.Column<string>(type: "TEXT", maxLength: 256, nullable: false),
                    Category = table.Column<string>(type: "TEXT", maxLength: 32, nullable: false),
                    Country = table.Column<string>(type: "TEXT", maxLength: 64, nullable: false),
                    CountryFlag = table.Column<string>(type: "TEXT", maxLength: 8, nullable: false),
                    Whatsapp = table.Column<string>(type: "TEXT", maxLength: 32, nullable: false),
                    Tagline = table.Column<string>(type: "TEXT", maxLength: 512, nullable: true),
                    InstagramUrl = table.Column<string>(type: "TEXT", maxLength: 512, nullable: true),
                    TikTokUrl = table.Column<string>(type: "TEXT", maxLength: 512, nullable: true),
                    FacebookUrl = table.Column<string>(type: "TEXT", maxLength: 512, nullable: true),
                    WebsiteUrl = table.Column<string>(type: "TEXT", maxLength: 512, nullable: true),
                    Status = table.Column<string>(type: "TEXT", maxLength: 16, nullable: false),
                    Active = table.Column<bool>(type: "INTEGER", nullable: false),
                    PromoCode = table.Column<string>(type: "TEXT", maxLength: 64, nullable: true),
                    UsageCount = table.Column<int>(type: "INTEGER", nullable: false),
                    RevenueUsd = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    DiscountType = table.Column<string>(type: "TEXT", maxLength: 16, nullable: true),
                    DiscountValue = table.Column<decimal>(type: "decimal(10,2)", nullable: true),
                    SubmittedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    ApprovedAt = table.Column<DateTime>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Partners", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Reviews",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Rating = table.Column<int>(type: "INTEGER", nullable: false),
                    Name = table.Column<string>(type: "TEXT", maxLength: 128, nullable: false),
                    Title = table.Column<string>(type: "TEXT", maxLength: 256, nullable: true),
                    Body = table.Column<string>(type: "TEXT", maxLength: 2000, nullable: false),
                    Country = table.Column<string>(type: "TEXT", maxLength: 64, nullable: false),
                    CountryFlag = table.Column<string>(type: "TEXT", maxLength: 8, nullable: false),
                    Status = table.Column<string>(type: "TEXT", maxLength: 16, nullable: false),
                    SubmittedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Reviews", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Orders_InvitationId",
                table: "Orders",
                column: "InvitationId");

            migrationBuilder.CreateIndex(
                name: "IX_Partners_PromoCode",
                table: "Partners",
                column: "PromoCode",
                unique: true,
                filter: "\"PromoCode\" IS NOT NULL");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Orders");

            migrationBuilder.DropTable(
                name: "Partners");

            migrationBuilder.DropTable(
                name: "Reviews");
        }
    }
}
