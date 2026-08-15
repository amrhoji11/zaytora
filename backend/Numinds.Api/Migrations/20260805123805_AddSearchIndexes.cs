using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Numinds.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddSearchIndexes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Reviews_Name",
                table: "Reviews",
                column: "Name");

            migrationBuilder.CreateIndex(
                name: "IX_Partners_BusinessName",
                table: "Partners",
                column: "BusinessName");

            migrationBuilder.CreateIndex(
                name: "IX_Partners_Email",
                table: "Partners",
                column: "Email");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_CustomerEmail",
                table: "Orders",
                column: "CustomerEmail");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_CustomerName",
                table: "Orders",
                column: "CustomerName");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Reviews_Name",
                table: "Reviews");

            migrationBuilder.DropIndex(
                name: "IX_Partners_BusinessName",
                table: "Partners");

            migrationBuilder.DropIndex(
                name: "IX_Partners_Email",
                table: "Partners");

            migrationBuilder.DropIndex(
                name: "IX_Orders_CustomerEmail",
                table: "Orders");

            migrationBuilder.DropIndex(
                name: "IX_Orders_CustomerName",
                table: "Orders");
        }
    }
}
