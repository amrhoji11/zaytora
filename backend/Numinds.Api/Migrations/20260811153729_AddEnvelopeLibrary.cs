using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Numinds.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddEnvelopeLibrary : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EnvelopePhotoUrl",
                table: "Templates");

            migrationBuilder.DropColumn(
                name: "EnvelopeSealXPercent",
                table: "Templates");

            migrationBuilder.DropColumn(
                name: "EnvelopeSealYPercent",
                table: "Templates");

            migrationBuilder.AddColumn<Guid>(
                name: "EnvelopeId",
                table: "Templates",
                type: "TEXT",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Envelopes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Name = table.Column<string>(type: "TEXT", maxLength: 64, nullable: false),
                    PhotoUrl = table.Column<string>(type: "TEXT", maxLength: 1024, nullable: false),
                    SealXPercent = table.Column<double>(type: "REAL", nullable: false),
                    SealYPercent = table.Column<double>(type: "REAL", nullable: false),
                    IsActive = table.Column<bool>(type: "INTEGER", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Envelopes", x => x.Id);
                });

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000001"),
                column: "EnvelopeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000002"),
                column: "EnvelopeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000003"),
                column: "EnvelopeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000004"),
                column: "EnvelopeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000005"),
                column: "EnvelopeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000006"),
                column: "EnvelopeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000007"),
                column: "EnvelopeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000008"),
                column: "EnvelopeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000009"),
                column: "EnvelopeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-00000000000a"),
                column: "EnvelopeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-00000000000b"),
                column: "EnvelopeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-00000000000c"),
                column: "EnvelopeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-00000000000d"),
                column: "EnvelopeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-00000000000e"),
                column: "EnvelopeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-00000000000f"),
                column: "EnvelopeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000010"),
                column: "EnvelopeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000011"),
                column: "EnvelopeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000012"),
                column: "EnvelopeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000013"),
                column: "EnvelopeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000014"),
                column: "EnvelopeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000015"),
                column: "EnvelopeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000016"),
                column: "EnvelopeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000017"),
                column: "EnvelopeId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000018"),
                column: "EnvelopeId",
                value: null);

            migrationBuilder.CreateIndex(
                name: "IX_Templates_EnvelopeId",
                table: "Templates",
                column: "EnvelopeId");

            migrationBuilder.AddForeignKey(
                name: "FK_Templates_Envelopes_EnvelopeId",
                table: "Templates",
                column: "EnvelopeId",
                principalTable: "Envelopes",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Templates_Envelopes_EnvelopeId",
                table: "Templates");

            migrationBuilder.DropTable(
                name: "Envelopes");

            migrationBuilder.DropIndex(
                name: "IX_Templates_EnvelopeId",
                table: "Templates");

            migrationBuilder.DropColumn(
                name: "EnvelopeId",
                table: "Templates");

            migrationBuilder.AddColumn<string>(
                name: "EnvelopePhotoUrl",
                table: "Templates",
                type: "TEXT",
                maxLength: 1024,
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "EnvelopeSealXPercent",
                table: "Templates",
                type: "REAL",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "EnvelopeSealYPercent",
                table: "Templates",
                type: "REAL",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000001"),
                columns: new[] { "EnvelopePhotoUrl", "EnvelopeSealXPercent", "EnvelopeSealYPercent" },
                values: new object[] { null, null, null });

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000002"),
                columns: new[] { "EnvelopePhotoUrl", "EnvelopeSealXPercent", "EnvelopeSealYPercent" },
                values: new object[] { null, null, null });

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000003"),
                columns: new[] { "EnvelopePhotoUrl", "EnvelopeSealXPercent", "EnvelopeSealYPercent" },
                values: new object[] { null, null, null });

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000004"),
                columns: new[] { "EnvelopePhotoUrl", "EnvelopeSealXPercent", "EnvelopeSealYPercent" },
                values: new object[] { null, null, null });

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000005"),
                columns: new[] { "EnvelopePhotoUrl", "EnvelopeSealXPercent", "EnvelopeSealYPercent" },
                values: new object[] { null, null, null });

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000006"),
                columns: new[] { "EnvelopePhotoUrl", "EnvelopeSealXPercent", "EnvelopeSealYPercent" },
                values: new object[] { null, null, null });

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000007"),
                columns: new[] { "EnvelopePhotoUrl", "EnvelopeSealXPercent", "EnvelopeSealYPercent" },
                values: new object[] { null, null, null });

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000008"),
                columns: new[] { "EnvelopePhotoUrl", "EnvelopeSealXPercent", "EnvelopeSealYPercent" },
                values: new object[] { null, null, null });

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000009"),
                columns: new[] { "EnvelopePhotoUrl", "EnvelopeSealXPercent", "EnvelopeSealYPercent" },
                values: new object[] { null, null, null });

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-00000000000a"),
                columns: new[] { "EnvelopePhotoUrl", "EnvelopeSealXPercent", "EnvelopeSealYPercent" },
                values: new object[] { null, null, null });

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-00000000000b"),
                columns: new[] { "EnvelopePhotoUrl", "EnvelopeSealXPercent", "EnvelopeSealYPercent" },
                values: new object[] { null, null, null });

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-00000000000c"),
                columns: new[] { "EnvelopePhotoUrl", "EnvelopeSealXPercent", "EnvelopeSealYPercent" },
                values: new object[] { null, null, null });

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-00000000000d"),
                columns: new[] { "EnvelopePhotoUrl", "EnvelopeSealXPercent", "EnvelopeSealYPercent" },
                values: new object[] { null, null, null });

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-00000000000e"),
                columns: new[] { "EnvelopePhotoUrl", "EnvelopeSealXPercent", "EnvelopeSealYPercent" },
                values: new object[] { null, null, null });

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-00000000000f"),
                columns: new[] { "EnvelopePhotoUrl", "EnvelopeSealXPercent", "EnvelopeSealYPercent" },
                values: new object[] { null, null, null });

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000010"),
                columns: new[] { "EnvelopePhotoUrl", "EnvelopeSealXPercent", "EnvelopeSealYPercent" },
                values: new object[] { null, null, null });

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000011"),
                columns: new[] { "EnvelopePhotoUrl", "EnvelopeSealXPercent", "EnvelopeSealYPercent" },
                values: new object[] { null, null, null });

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000012"),
                columns: new[] { "EnvelopePhotoUrl", "EnvelopeSealXPercent", "EnvelopeSealYPercent" },
                values: new object[] { null, null, null });

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000013"),
                columns: new[] { "EnvelopePhotoUrl", "EnvelopeSealXPercent", "EnvelopeSealYPercent" },
                values: new object[] { null, null, null });

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000014"),
                columns: new[] { "EnvelopePhotoUrl", "EnvelopeSealXPercent", "EnvelopeSealYPercent" },
                values: new object[] { null, null, null });

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000015"),
                columns: new[] { "EnvelopePhotoUrl", "EnvelopeSealXPercent", "EnvelopeSealYPercent" },
                values: new object[] { null, null, null });

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000016"),
                columns: new[] { "EnvelopePhotoUrl", "EnvelopeSealXPercent", "EnvelopeSealYPercent" },
                values: new object[] { null, null, null });

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000017"),
                columns: new[] { "EnvelopePhotoUrl", "EnvelopeSealXPercent", "EnvelopeSealYPercent" },
                values: new object[] { null, null, null });

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000018"),
                columns: new[] { "EnvelopePhotoUrl", "EnvelopeSealXPercent", "EnvelopeSealYPercent" },
                values: new object[] { null, null, null });
        }
    }
}
