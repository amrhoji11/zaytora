using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Numinds.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddInvitationGiftDetails : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "GiftAccountHolderName",
                table: "Invitations",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "GiftBankTransferEnabled",
                table: "Invitations",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "GiftFeeCoverage",
                table: "Invitations",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "GiftMessage",
                table: "Invitations",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "GiftQrImageUrl",
                table: "Invitations",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "GiftWishlistEnabled",
                table: "Invitations",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "GiftWishlistItemsJson",
                table: "Invitations",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "GiftAccountHolderName",
                table: "Invitations");

            migrationBuilder.DropColumn(
                name: "GiftBankTransferEnabled",
                table: "Invitations");

            migrationBuilder.DropColumn(
                name: "GiftFeeCoverage",
                table: "Invitations");

            migrationBuilder.DropColumn(
                name: "GiftMessage",
                table: "Invitations");

            migrationBuilder.DropColumn(
                name: "GiftQrImageUrl",
                table: "Invitations");

            migrationBuilder.DropColumn(
                name: "GiftWishlistEnabled",
                table: "Invitations");

            migrationBuilder.DropColumn(
                name: "GiftWishlistItemsJson",
                table: "Invitations");
        }
    }
}
