using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Numinds.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddTemplateFontFieldsAndMusicSuggestions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DefaultMusicTitle",
                table: "Templates",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DefaultMusicUrl",
                table: "Templates",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "EventTitleFont",
                table: "Templates",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FamilyNamesFont",
                table: "Templates",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "InvitationTextFont",
                table: "Templates",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ThankYouTextFont",
                table: "Templates",
                type: "text",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "MusicSuggestions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: false),
                    Artist = table.Column<string>(type: "text", nullable: true),
                    Url = table.Column<string>(type: "text", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    SortOrder = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MusicSuggestions", x => x.Id);
                });

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000001"),
                columns: new[] { "DefaultMusicTitle", "DefaultMusicUrl", "EventTitleFont", "FamilyNamesFont", "InvitationTextFont", "ThankYouTextFont" },
                values: new object[] { null, null, null, null, null, null });

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000002"),
                columns: new[] { "DefaultMusicTitle", "DefaultMusicUrl", "EventTitleFont", "FamilyNamesFont", "InvitationTextFont", "ThankYouTextFont" },
                values: new object[] { null, null, null, null, null, null });

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000003"),
                columns: new[] { "DefaultMusicTitle", "DefaultMusicUrl", "EventTitleFont", "FamilyNamesFont", "InvitationTextFont", "ThankYouTextFont" },
                values: new object[] { null, null, null, null, null, null });

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000004"),
                columns: new[] { "DefaultMusicTitle", "DefaultMusicUrl", "EventTitleFont", "FamilyNamesFont", "InvitationTextFont", "ThankYouTextFont" },
                values: new object[] { null, null, null, null, null, null });

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000005"),
                columns: new[] { "DefaultMusicTitle", "DefaultMusicUrl", "EventTitleFont", "FamilyNamesFont", "InvitationTextFont", "ThankYouTextFont" },
                values: new object[] { null, null, null, null, null, null });

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000006"),
                columns: new[] { "DefaultMusicTitle", "DefaultMusicUrl", "EventTitleFont", "FamilyNamesFont", "InvitationTextFont", "ThankYouTextFont" },
                values: new object[] { null, null, null, null, null, null });

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000007"),
                columns: new[] { "DefaultMusicTitle", "DefaultMusicUrl", "EventTitleFont", "FamilyNamesFont", "InvitationTextFont", "ThankYouTextFont" },
                values: new object[] { null, null, null, null, null, null });

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000008"),
                columns: new[] { "DefaultMusicTitle", "DefaultMusicUrl", "EventTitleFont", "FamilyNamesFont", "InvitationTextFont", "ThankYouTextFont" },
                values: new object[] { null, null, null, null, null, null });

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000009"),
                columns: new[] { "DefaultMusicTitle", "DefaultMusicUrl", "EventTitleFont", "FamilyNamesFont", "InvitationTextFont", "ThankYouTextFont" },
                values: new object[] { null, null, null, null, null, null });

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-00000000000a"),
                columns: new[] { "DefaultMusicTitle", "DefaultMusicUrl", "EventTitleFont", "FamilyNamesFont", "InvitationTextFont", "ThankYouTextFont" },
                values: new object[] { null, null, null, null, null, null });

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-00000000000b"),
                columns: new[] { "DefaultMusicTitle", "DefaultMusicUrl", "EventTitleFont", "FamilyNamesFont", "InvitationTextFont", "ThankYouTextFont" },
                values: new object[] { null, null, null, null, null, null });

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-00000000000c"),
                columns: new[] { "DefaultMusicTitle", "DefaultMusicUrl", "EventTitleFont", "FamilyNamesFont", "InvitationTextFont", "ThankYouTextFont" },
                values: new object[] { null, null, null, null, null, null });

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-00000000000d"),
                columns: new[] { "DefaultMusicTitle", "DefaultMusicUrl", "EventTitleFont", "FamilyNamesFont", "InvitationTextFont", "ThankYouTextFont" },
                values: new object[] { null, null, null, null, null, null });

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-00000000000e"),
                columns: new[] { "DefaultMusicTitle", "DefaultMusicUrl", "EventTitleFont", "FamilyNamesFont", "InvitationTextFont", "ThankYouTextFont" },
                values: new object[] { null, null, null, null, null, null });

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-00000000000f"),
                columns: new[] { "DefaultMusicTitle", "DefaultMusicUrl", "EventTitleFont", "FamilyNamesFont", "InvitationTextFont", "ThankYouTextFont" },
                values: new object[] { null, null, null, null, null, null });

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000010"),
                columns: new[] { "DefaultMusicTitle", "DefaultMusicUrl", "EventTitleFont", "FamilyNamesFont", "InvitationTextFont", "ThankYouTextFont" },
                values: new object[] { null, null, null, null, null, null });

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000011"),
                columns: new[] { "DefaultMusicTitle", "DefaultMusicUrl", "EventTitleFont", "FamilyNamesFont", "InvitationTextFont", "ThankYouTextFont" },
                values: new object[] { null, null, null, null, null, null });

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000012"),
                columns: new[] { "DefaultMusicTitle", "DefaultMusicUrl", "EventTitleFont", "FamilyNamesFont", "InvitationTextFont", "ThankYouTextFont" },
                values: new object[] { null, null, null, null, null, null });

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000013"),
                columns: new[] { "DefaultMusicTitle", "DefaultMusicUrl", "EventTitleFont", "FamilyNamesFont", "InvitationTextFont", "ThankYouTextFont" },
                values: new object[] { null, null, null, null, null, null });

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000014"),
                columns: new[] { "DefaultMusicTitle", "DefaultMusicUrl", "EventTitleFont", "FamilyNamesFont", "InvitationTextFont", "ThankYouTextFont" },
                values: new object[] { null, null, null, null, null, null });

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000015"),
                columns: new[] { "DefaultMusicTitle", "DefaultMusicUrl", "EventTitleFont", "FamilyNamesFont", "InvitationTextFont", "ThankYouTextFont" },
                values: new object[] { null, null, null, null, null, null });

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000016"),
                columns: new[] { "DefaultMusicTitle", "DefaultMusicUrl", "EventTitleFont", "FamilyNamesFont", "InvitationTextFont", "ThankYouTextFont" },
                values: new object[] { null, null, null, null, null, null });

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000017"),
                columns: new[] { "DefaultMusicTitle", "DefaultMusicUrl", "EventTitleFont", "FamilyNamesFont", "InvitationTextFont", "ThankYouTextFont" },
                values: new object[] { null, null, null, null, null, null });

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000018"),
                columns: new[] { "DefaultMusicTitle", "DefaultMusicUrl", "EventTitleFont", "FamilyNamesFont", "InvitationTextFont", "ThankYouTextFont" },
                values: new object[] { null, null, null, null, null, null });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MusicSuggestions");

            migrationBuilder.DropColumn(
                name: "DefaultMusicTitle",
                table: "Templates");

            migrationBuilder.DropColumn(
                name: "DefaultMusicUrl",
                table: "Templates");

            migrationBuilder.DropColumn(
                name: "EventTitleFont",
                table: "Templates");

            migrationBuilder.DropColumn(
                name: "FamilyNamesFont",
                table: "Templates");

            migrationBuilder.DropColumn(
                name: "InvitationTextFont",
                table: "Templates");

            migrationBuilder.DropColumn(
                name: "ThankYouTextFont",
                table: "Templates");
        }
    }
}
