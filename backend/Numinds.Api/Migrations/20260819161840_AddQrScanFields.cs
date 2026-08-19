using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Numinds.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddQrScanFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "QrGuestCount",
                table: "Invitations",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "QrScanEnd",
                table: "Invitations",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "QrScanStart",
                table: "Invitations",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "QrScannerCount",
                table: "Invitations",
                type: "integer",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "QrGuestCount",
                table: "Invitations");

            migrationBuilder.DropColumn(
                name: "QrScanEnd",
                table: "Invitations");

            migrationBuilder.DropColumn(
                name: "QrScanStart",
                table: "Invitations");

            migrationBuilder.DropColumn(
                name: "QrScannerCount",
                table: "Invitations");
        }
    }
}
