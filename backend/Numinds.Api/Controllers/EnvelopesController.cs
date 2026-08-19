using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Numinds.Api.Data;
using Numinds.Api.Models;
using Numinds.Api.Models.Dtos;
using Numinds.Api.Models.Entities;
using Numinds.Api.Services;

namespace Numinds.Api.Controllers;

// The admin-managed envelope-photo library (see Models/Entities/Envelope.cs)
// — add a photo + seal position once from /admin/envelopes, then assign it
// to any number of templates via TemplateEditModal's picker, instead of
// re-uploading/re-positioning per template.
[ApiController]
[Route("api/envelopes")]
public class EnvelopesController(NumindsDbContext db, IFileStorageService storage) : ControllerBase
{
    private const long MaxImageBytes = 8 * 1024 * 1024;
    private static readonly Dictionary<string, string> AllowedImageContentTypes = new()
    {
        ["image/png"] = ".png",
        ["image/jpeg"] = ".jpg",
        ["image/webp"] = ".webp",
    };
    private static readonly HashSet<string> ValidOpeningStyles = ["flap", "scroll", "doorSlide", "doorFold"];

    // "door" was this library's opening-style name before it split into two
    // distinct variants (doorSlide/doorFold) — normalized to doorSlide, the
    // one it originally meant, so envelopes saved under the old name keep
    // working instead of silently falling back to "flap".
    private static string NormalizeOpeningStyle(string? style) =>
        style switch
        {
            "door" => "doorSlide",
            not null when ValidOpeningStyles.Contains(style) => style,
            _ => "flap",
        };

    // GET /api/envelopes?includeInactive=true — admin picker (TemplateEditModal)
    // passes includeInactive so a template already pointing at a since-
    // deactivated envelope can still show it selected; the library page
    // itself also needs the full list to manage inactive rows.
    [HttpGet]
    [Authorize(Roles = Roles.Admin)]
    public async Task<ActionResult<IEnumerable<EnvelopeDto>>> GetAll(
        [FromQuery] bool includeInactive,
        CancellationToken cancellationToken)
    {
        var query = db.Envelopes.AsNoTracking().AsQueryable();
        if (!includeInactive)
        {
            query = query.Where(e => e.IsActive);
        }

        // FoldPointsJson needs actual .NET JSON parsing (System.Text.Json
        // can't translate into SQL), so the raw rows are materialized first
        // and mapped to DTOs afterward via ToDto, same as the existing
        // per-row Id-lowercasing already done below it used to do inline.
        var rows = await query
            .OrderBy(e => e.Name)
            .Select(e => new { Envelope = e, TemplateCount = e.Templates.Count })
            .ToListAsync(cancellationToken);

        return Ok(rows.Select(r => ToDto(r.Envelope, r.TemplateCount)));
    }

    // POST /api/envelopes/image — admin uploads the envelope photo, gets
    // back a URL to submit with Create/Update. Uploaded to R2 (see
    // IFileStorageService) — same pattern as ThankYouSuggestionsController.UploadImage.
    [HttpPost("image")]
    [Authorize(Roles = Roles.Admin)]
    public async Task<ActionResult<EnvelopeImageUploadResponse>> UploadImage(
        IFormFile file,
        CancellationToken cancellationToken)
    {
        if (file is null || file.Length == 0)
        {
            return BadRequest(new { message = "No file uploaded." });
        }
        if (file.Length > MaxImageBytes)
        {
            return BadRequest(new { message = "Image must be 8MB or smaller." });
        }
        if (!AllowedImageContentTypes.TryGetValue(file.ContentType, out var extension))
        {
            return BadRequest(new { message = "Image must be a JPG, PNG, or WebP file." });
        }

        var url = await storage.UploadAsync(file, "envelopes", extension, $"{Request.Scheme}://{Request.Host}", cancellationToken);
        return Ok(new EnvelopeImageUploadResponse { Url = url });
    }

    [HttpPost]
    [Authorize(Roles = Roles.Admin)]
    public async Task<ActionResult<EnvelopeDto>> Create(
        [FromBody] EnvelopeWriteRequest request,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.Name) || string.IsNullOrWhiteSpace(request.PhotoUrl))
        {
            return BadRequest(new { error = "Name and PhotoUrl are required." });
        }

        var envelope = new Envelope
        {
            Id = Guid.NewGuid(),
            Name = request.Name.Trim(),
            PhotoUrl = request.PhotoUrl,
            SealXPercent = request.SealXPercent,
            SealYPercent = request.SealYPercent,
            OpeningStyle = NormalizeOpeningStyle(request.OpeningStyle),
            FoldPointsJson = EnvelopeFoldPointsJson.Serialize(request.FoldPoints),
            IsActive = request.IsActive,
            CreatedAt = DateTime.UtcNow,
        };

        db.Envelopes.Add(envelope);
        await db.SaveChangesAsync(cancellationToken);

        return CreatedAtAction(nameof(GetAll), ToDto(envelope, templateCount: 0));
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = Roles.Admin)]
    public async Task<ActionResult<EnvelopeDto>> Update(
        Guid id,
        [FromBody] EnvelopeWriteRequest request,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.Name) || string.IsNullOrWhiteSpace(request.PhotoUrl))
        {
            return BadRequest(new { error = "Name and PhotoUrl are required." });
        }

        var envelope = await db.Envelopes.FirstOrDefaultAsync(e => e.Id == id, cancellationToken);
        if (envelope is null)
        {
            return NotFound();
        }

        var oldPhotoUrl = envelope.PhotoUrl;

        envelope.Name = request.Name.Trim();
        envelope.PhotoUrl = request.PhotoUrl;
        envelope.SealXPercent = request.SealXPercent;
        envelope.SealYPercent = request.SealYPercent;
        envelope.OpeningStyle = NormalizeOpeningStyle(request.OpeningStyle);
        envelope.FoldPointsJson = EnvelopeFoldPointsJson.Serialize(request.FoldPoints);
        envelope.IsActive = request.IsActive;

        await db.SaveChangesAsync(cancellationToken);

        // Best-effort: clean up the old photo now that the new one is saved,
        // skipped if it wasn't actually replaced.
        if (!string.IsNullOrWhiteSpace(oldPhotoUrl) && oldPhotoUrl != envelope.PhotoUrl)
        {
            await storage.DeleteAsync(oldPhotoUrl, cancellationToken);
        }

        var templateCount = await db.Templates.CountAsync(t => t.EnvelopeId == id, cancellationToken);
        return Ok(ToDto(envelope, templateCount));
    }

    // DELETE /api/envelopes/{id} — refused once any template is still
    // assigned it (unassign those templates first), same reasoning as
    // TemplatesController.DeleteTemplate's usage guard.
    [HttpDelete("{id:guid}")]
    [Authorize(Roles = Roles.Admin)]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var envelope = await db.Envelopes.FirstOrDefaultAsync(e => e.Id == id, cancellationToken);
        if (envelope is null)
        {
            return NotFound();
        }

        var templateCount = await db.Templates.CountAsync(t => t.EnvelopeId == id, cancellationToken);
        if (templateCount > 0)
        {
            return Conflict(new { error = "This envelope is assigned to one or more templates. Unassign it from them first." });
        }

        db.Envelopes.Remove(envelope);
        await db.SaveChangesAsync(cancellationToken);

        await storage.DeleteAsync(envelope.PhotoUrl, cancellationToken);

        return NoContent();
    }

    private static EnvelopeDto ToDto(Envelope e, int templateCount) => new()
    {
        Id = e.Id.ToString().ToLowerInvariant(),
        Name = e.Name,
        PhotoUrl = e.PhotoUrl,
        SealXPercent = e.SealXPercent,
        SealYPercent = e.SealYPercent,
        OpeningStyle = e.OpeningStyle,
        FoldPoints = EnvelopeFoldPointsJson.Parse(e.FoldPointsJson),
        IsActive = e.IsActive,
        TemplateCount = templateCount,
    };
}
