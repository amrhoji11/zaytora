using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Numinds.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddTemplateHomepageFeatured : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsHomepageFeatured",
                table: "Templates",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000001"),
                column: "IsHomepageFeatured",
                value: false);

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000002"),
                column: "IsHomepageFeatured",
                value: false);

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000003"),
                column: "IsHomepageFeatured",
                value: false);

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000004"),
                column: "IsHomepageFeatured",
                value: false);

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000005"),
                column: "IsHomepageFeatured",
                value: false);

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000006"),
                column: "IsHomepageFeatured",
                value: false);

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000007"),
                column: "IsHomepageFeatured",
                value: false);

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000008"),
                column: "IsHomepageFeatured",
                value: false);

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000009"),
                column: "IsHomepageFeatured",
                value: false);

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-00000000000a"),
                column: "IsHomepageFeatured",
                value: false);

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-00000000000b"),
                column: "IsHomepageFeatured",
                value: false);

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-00000000000c"),
                column: "IsHomepageFeatured",
                value: false);

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-00000000000d"),
                column: "IsHomepageFeatured",
                value: false);

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-00000000000e"),
                column: "IsHomepageFeatured",
                value: false);

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-00000000000f"),
                column: "IsHomepageFeatured",
                value: false);

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000010"),
                column: "IsHomepageFeatured",
                value: false);

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000011"),
                column: "IsHomepageFeatured",
                value: false);

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000012"),
                column: "IsHomepageFeatured",
                value: false);

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000013"),
                column: "IsHomepageFeatured",
                value: false);

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000014"),
                column: "IsHomepageFeatured",
                value: false);

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000015"),
                column: "IsHomepageFeatured",
                value: false);

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000016"),
                column: "IsHomepageFeatured",
                value: false);

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000017"),
                column: "IsHomepageFeatured",
                value: false);

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: new Guid("8f14e45f-ceea-467e-adb2-000000000018"),
                column: "IsHomepageFeatured",
                value: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsHomepageFeatured",
                table: "Templates");
        }
    }
}
