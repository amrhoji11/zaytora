using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Numinds.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddUserCreatedAt : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "AspNetUsers",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(2020, 1, 1, 0, 0, 0, DateTimeKind.Utc));

            // Backfill existing accounts with a synthetic-but-strictly-
            // increasing CreatedAt based on each row's physical insertion
            // order (ctid) -- there was no creation-date column before this
            // migration, so this is the closest available proxy for "who
            // joined first" among already-existing accounts (powers
            // /admin/users' oldest-to-newest numbering). Postgres only:
            // local dev's SQLite database is disposable and every account
            // there is a throwaway test account anyway, so it's fine for
            // them to all land on the default above. Every account created
            // from here on, on any provider, gets a real timestamp -- see
            // ApplicationUser.CreatedAt's property default.
            if (migrationBuilder.ActiveProvider == "Npgsql.EntityFrameworkCore.PostgreSQL")
            {
                migrationBuilder.Sql(@"
                    UPDATE ""AspNetUsers"" AS u
                    SET ""CreatedAt"" = TIMESTAMPTZ '2020-01-01T00:00:00Z' + (ranked.rn * INTERVAL '1 minute')
                    FROM (SELECT ""Id"", ROW_NUMBER() OVER (ORDER BY ctid) AS rn FROM ""AspNetUsers"") AS ranked
                    WHERE u.""Id"" = ranked.""Id"";
                ");
            }
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "AspNetUsers");
        }
    }
}
