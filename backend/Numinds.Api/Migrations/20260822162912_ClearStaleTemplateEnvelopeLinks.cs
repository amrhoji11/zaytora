using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Numinds.Api.Migrations
{
    /// <inheritdoc />
    public partial class ClearStaleTemplateEnvelopeLinks : Migration
    {
        // Data-only cleanup: the admin "envelope library" picker (TemplateEditModal)
        // was dropped once OpeningVideoUrl became the single unified envelope
        // field, but any template's EnvelopeId assigned before that change was
        // left in place -- invisible in the admin UI, yet still resolved into
        // EnvelopePhotoUrl by TemplatesController and rendered as a stale
        // door/scroll/flap cover that silently overrode a newly-uploaded
        // OpeningVideoUrl (the exact bug this migration is fixing for good).
        // Irreversible by design, same as any other one-time data backfill.

        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("UPDATE \"Templates\" SET \"EnvelopeId\" = NULL;");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
        }
    }
}
