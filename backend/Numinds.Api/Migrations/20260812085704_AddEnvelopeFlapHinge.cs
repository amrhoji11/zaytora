using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Numinds.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddEnvelopeFlapHinge : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "FlapHinge",
                table: "Envelopes",
                type: "TEXT",
                maxLength: 16,
                nullable: false,
                defaultValue: "all");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FlapHinge",
                table: "Envelopes");
        }
    }
}
