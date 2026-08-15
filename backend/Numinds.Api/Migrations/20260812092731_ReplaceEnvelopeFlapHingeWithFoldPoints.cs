using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Numinds.Api.Migrations
{
    /// <inheritdoc />
    public partial class ReplaceEnvelopeFlapHingeWithFoldPoints : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FlapHinge",
                table: "Envelopes");

            migrationBuilder.AddColumn<string>(
                name: "FoldPointsJson",
                table: "Envelopes",
                type: "TEXT",
                maxLength: 2048,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FoldPointsJson",
                table: "Envelopes");

            migrationBuilder.AddColumn<string>(
                name: "FlapHinge",
                table: "Envelopes",
                type: "TEXT",
                maxLength: 16,
                nullable: false,
                defaultValue: "");
        }
    }
}
