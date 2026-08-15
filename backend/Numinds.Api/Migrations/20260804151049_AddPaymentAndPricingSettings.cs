using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Numinds.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddPaymentAndPricingSettings : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PaymentSettings",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    RecipientName = table.Column<string>(type: "TEXT", maxLength: 128, nullable: false),
                    AccountNumber = table.Column<string>(type: "TEXT", maxLength: 64, nullable: false),
                    BankName = table.Column<string>(type: "TEXT", maxLength: 128, nullable: true),
                    Iban = table.Column<string>(type: "TEXT", maxLength: 64, nullable: true),
                    Instructions = table.Column<string>(type: "TEXT", maxLength: 1024, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PaymentSettings", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PricingSettings",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    BasePriceUsd = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    QrRateUsd = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    DefaultPartnerDiscountType = table.Column<string>(type: "TEXT", maxLength: 16, nullable: false),
                    DefaultPartnerDiscountValue = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    PlatformDiscountType = table.Column<string>(type: "TEXT", maxLength: 16, nullable: false),
                    PlatformDiscountValue = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    PlatformDiscountCode = table.Column<string>(type: "TEXT", maxLength: 32, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PricingSettings", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "PaymentSettings",
                columns: new[] { "Id", "AccountNumber", "BankName", "Iban", "Instructions", "RecipientName" },
                values: new object[] { new Guid("44444444-4444-4444-4444-444444444444"), "", null, null, null, "" });

            migrationBuilder.InsertData(
                table: "PricingSettings",
                columns: new[] { "Id", "BasePriceUsd", "DefaultPartnerDiscountType", "DefaultPartnerDiscountValue", "PlatformDiscountCode", "PlatformDiscountType", "PlatformDiscountValue", "QrRateUsd" },
                values: new object[] { new Guid("55555555-5555-5555-5555-555555555555"), 17.99m, "percent", 33.3m, "PARTNER2026", "percent", 33.3m, 0.45m });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PaymentSettings");

            migrationBuilder.DropTable(
                name: "PricingSettings");
        }
    }
}
