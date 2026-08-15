using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Numinds.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddTemplateEnvelopePhoto : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
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
        }
    }
}
