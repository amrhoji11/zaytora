using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Numinds.Api.Data;
using Numinds.Api.Models;
using Numinds.Api.Models.Dtos;
using Numinds.Api.Models.Entities;
using Numinds.Api.Services;

namespace Numinds.Api.Controllers;

[ApiController]
[Route("api/music-suggestions")]
public class MusicSuggestionsController(NumindsDbContext db, IFileStorageService storage) : ControllerBase
{
    // A phone-sized background track a couple of minutes long comfortably
    // fits under this — same reasoning as TemplatesController's video cap,
    // just a bigger ceiling since audio-only files are far smaller than
    // video at any given length.
    private const long MaxAudioBytes = 8 * 1024 * 1024;
    private static readonly Dictionary<string, string> AllowedAudioContentTypes = new()
    {
        ["audio/mpeg"] = ".mp3",
        ["audio/mp3"] = ".mp3",
        ["audio/wav"] = ".wav",
        ["audio/x-wav"] = ".wav",
        ["audio/ogg"] = ".ogg",
        ["audio/aac"] = ".aac",
        ["audio/mp4"] = ".m4a",
        ["audio/x-m4a"] = ".m4a",
    };

    // GET /api/music-suggestions?includeInactive=true — public by default
    // (Step13Music's library needs the active list without auth), same
    // includeInactive convention as ThankYouSuggestionsController.
    [HttpGet]
    public async Task<ActionResult<IEnumerable<MusicSuggestionDto>>> GetAll(
        [FromQuery] bool includeInactive,
        CancellationToken cancellationToken)
    {
        var query = db.MusicSuggestions.AsNoTracking().AsQueryable();
        if (!includeInactive)
        {
            query = query.Where(s => s.IsActive);
        }

        var suggestions = await query
            .OrderBy(s => s.SortOrder)
            .ThenBy(s => s.CreatedAt)
            .Select(s => ToDto(s))
            .ToListAsync(cancellationToken);

        return Ok(suggestions);
    }

    // POST /api/music-suggestions/audio — admin uploads a track file, gets
    // back a URL to submit as Url with create/update (or straight onto a
    // Template's DefaultMusicUrl from TemplateEditModal, which shares this
    // same endpoint rather than duplicating an upload path). A plain
    // YouTube/external link never touches this endpoint at all.
    [HttpPost("audio")]
    [Authorize(Roles = Roles.Admin)]
    public async Task<ActionResult<MusicSuggestionAudioUploadResponse>> UploadAudio(
        IFormFile file,
        CancellationToken cancellationToken)
    {
        if (file is null || file.Length == 0)
        {
            return BadRequest(new { message = "No file uploaded." });
        }
        if (file.Length > MaxAudioBytes)
        {
            return BadRequest(new { message = "Audio must be 8MB or smaller." });
        }
        if (!AllowedAudioContentTypes.TryGetValue(file.ContentType, out var extension))
        {
            return BadRequest(new { message = "Audio must be an MP3, WAV, OGG, AAC, or M4A file." });
        }

        var url = await storage.UploadAsync(file, "music-suggestions", extension, $"{Request.Scheme}://{Request.Host}", cancellationToken);
        return Ok(new MusicSuggestionAudioUploadResponse { Url = url });
    }

    [HttpPost]
    [Authorize(Roles = Roles.Admin)]
    public async Task<ActionResult<MusicSuggestionDto>> Create(
        [FromBody] MusicSuggestionWriteRequest request,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.Title) || string.IsNullOrWhiteSpace(request.Url))
        {
            return BadRequest(new { error = "Title and Url are required." });
        }

        var suggestion = new MusicSuggestion
        {
            Id = Guid.NewGuid(),
            Title = request.Title.Trim(),
            Artist = string.IsNullOrWhiteSpace(request.Artist) ? null : request.Artist.Trim(),
            Url = request.Url,
            IsActive = request.IsActive,
            SortOrder = request.SortOrder,
            CreatedAt = DateTime.UtcNow,
        };

        db.MusicSuggestions.Add(suggestion);
        await db.SaveChangesAsync(cancellationToken);

        return CreatedAtAction(nameof(GetAll), ToDto(suggestion));
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = Roles.Admin)]
    public async Task<ActionResult<MusicSuggestionDto>> Update(
        Guid id,
        [FromBody] MusicSuggestionWriteRequest request,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.Title) || string.IsNullOrWhiteSpace(request.Url))
        {
            return BadRequest(new { error = "Title and Url are required." });
        }

        var suggestion = await db.MusicSuggestions.FirstOrDefaultAsync(s => s.Id == id, cancellationToken);
        if (suggestion is null)
        {
            return NotFound();
        }

        var oldUrl = suggestion.Url;

        suggestion.Title = request.Title.Trim();
        suggestion.Artist = string.IsNullOrWhiteSpace(request.Artist) ? null : request.Artist.Trim();
        suggestion.Url = request.Url;
        suggestion.IsActive = request.IsActive;
        suggestion.SortOrder = request.SortOrder;

        await db.SaveChangesAsync(cancellationToken);

        if (!string.IsNullOrWhiteSpace(oldUrl) && oldUrl != suggestion.Url)
        {
            await storage.DeleteAsync(oldUrl, cancellationToken);
        }

        return Ok(ToDto(suggestion));
    }

    [HttpPatch("{id:guid}/active")]
    [Authorize(Roles = Roles.Admin)]
    public async Task<IActionResult> SetActive(
        Guid id,
        [FromBody] SetMusicSuggestionActiveRequest request,
        CancellationToken cancellationToken)
    {
        var suggestion = await db.MusicSuggestions.FirstOrDefaultAsync(s => s.Id == id, cancellationToken);
        if (suggestion is null)
        {
            return NotFound();
        }

        suggestion.IsActive = request.IsActive;
        await db.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = Roles.Admin)]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var suggestion = await db.MusicSuggestions.FirstOrDefaultAsync(s => s.Id == id, cancellationToken);
        if (suggestion is null)
        {
            return NotFound();
        }

        db.MusicSuggestions.Remove(suggestion);
        await db.SaveChangesAsync(cancellationToken);

        await storage.DeleteAsync(suggestion.Url, cancellationToken);

        return NoContent();
    }

    private static MusicSuggestionDto ToDto(MusicSuggestion s) => new()
    {
        Id = s.Id.ToString().ToLowerInvariant(),
        Title = s.Title,
        Artist = s.Artist,
        Url = s.Url,
        IsActive = s.IsActive,
        SortOrder = s.SortOrder,
    };
}
