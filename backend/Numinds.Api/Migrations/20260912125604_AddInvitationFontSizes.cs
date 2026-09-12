using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Numinds.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddInvitationFontSizes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "EventTitleFontSize",
                table: "Invitations",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "FamilyNamesFontSize",
                table: "Invitations",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "InvitationTextFontSize",
                table: "Invitations",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "NamesFontSize",
                table: "Invitations",
                type: "integer",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EventTitleFontSize",
                table: "Invitations");

            migrationBuilder.DropColumn(
                name: "FamilyNamesFontSize",
                table: "Invitations");

            migrationBuilder.DropColumn(
                name: "InvitationTextFontSize",
                table: "Invitations");

            migrationBuilder.DropColumn(
                name: "NamesFontSize",
                table: "Invitations");
        }
    }
}
