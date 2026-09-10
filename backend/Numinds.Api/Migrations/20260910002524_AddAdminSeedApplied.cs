using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Numinds.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddAdminSeedApplied : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "AdminSeedApplied",
                table: "AspNetUsers",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AdminSeedApplied",
                table: "AspNetUsers");
        }
    }
}
