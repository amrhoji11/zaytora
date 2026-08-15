using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Numinds.Api.Data;
using Numinds.Api.Models;
using Numinds.Api.Models.Dtos;
using Numinds.Api.Models.Entities;

namespace Numinds.Api.Controllers;

[ApiController]
[Route("api/thank-you-suggestions")]
public class ThankYouSuggestionsController(NumindsDbContext db, IWebHostEnvironment env) : ControllerBase
{
    private const long MaxImageBytes = 5 * 1024 * 1024;
    private static readonly Dictionary<string, string> AllowedImageContentTypes = new()
    {
        ["image/png"] = ".png",
        ["image/jpeg"] = ".jpg",
        ["image/webp"] = ".webp",
    };

    // GET /api/thank-you-suggestions?includeInactive=true — public by default
    // (Step04BasicInfo's suggestions grid needs the active list without
    // auth), same includeInactive convention as TemplatesController.
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ThankYouSuggestionDto>>> GetAll(
        [FromQuery] bool includeInactive,
        CancellationToken cancellationToken)
    {
        var query = db.ThankYouSuggestions.AsNoTracking().AsQueryable();
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

    // POST /api/thank-you-suggestions/image — admin uploads a suggestion
    // card image, gets back a URL to submit with the create/update request.
    // Same wwwroot/uploads/<feature> pattern as PartnersController.UploadLogo.
    [HttpPost("image")]
    [Authorize(Roles = Roles.Admin)]
    public async Task<ActionResult<ThankYouSuggestionImageUploadResponse>> UploadImage(
        IFormFile file,
        CancellationToken cancellationToken)
    {
        if (file is null || file.Length == 0)
        {
            return BadRequest(new { message = "No file uploaded." });
        }
        if (file.Length > MaxImageBytes)
        {
            return BadRequest(new { message = "Image must be 5MB or smaller." });
        }
        if (!AllowedImageContentTypes.TryGetValue(file.ContentType, out var extension))
        {
            return BadRequest(new { message = "Image must be a JPG, PNG, or WebP file." });
        }

        var webRoot = env.WebRootPath ?? Path.Combine(env.ContentRootPath, "wwwroot");
        var uploadsDir = Path.Combine(webRoot, "uploads", "thank-you-suggestions");
        Directory.CreateDirectory(uploadsDir);

        var fileName = $"{Guid.NewGuid()}{extension}";
        var filePath = Path.Combine(uploadsDir, fileName);
        await using (var stream = System.IO.File.Create(filePath))
        {
            await file.CopyToAsync(stream, cancellationToken);
        }

        var url = $"{Request.Scheme}://{Request.Host}/uploads/thank-you-suggestions/{fileName}";
        return Ok(new ThankYouSuggestionImageUploadResponse { Url = url });
    }

    [HttpPost]
    [Authorize(Roles = Roles.Admin)]
    public async Task<ActionResult<ThankYouSuggestionDto>> Create(
        [FromBody] ThankYouSuggestionWriteRequest request,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.Label) || string.IsNullOrWhiteSpace(request.ImageUrl))
        {
            return BadRequest(new { error = "Label and ImageUrl are required." });
        }

        var suggestion = new ThankYouSuggestion
        {
            Id = Guid.NewGuid(),
            Label = request.Label.Trim(),
            ImageUrl = request.ImageUrl,
            IsActive = request.IsActive,
            SortOrder = request.SortOrder,
            CreatedAt = DateTime.UtcNow,
        };

        db.ThankYouSuggestions.Add(suggestion);
        await db.SaveChangesAsync(cancellationToken);

        return CreatedAtAction(nameof(GetAll), ToDto(suggestion));
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = Roles.Admin)]
    public async Task<ActionResult<ThankYouSuggestionDto>> Update(
        Guid id,
        [FromBody] ThankYouSuggestionWriteRequest request,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.Label) || string.IsNullOrWhiteSpace(request.ImageUrl))
        {
            return BadRequest(new { error = "Label and ImageUrl are required." });
        }

        var suggestion = await db.ThankYouSuggestions.FirstOrDefaultAsync(s => s.Id == id, cancellationToken);
        if (suggestion is null)
        {
            return NotFound();
        }

        suggestion.Label = request.Label.Trim();
        suggestion.ImageUrl = request.ImageUrl;
        suggestion.IsActive = request.IsActive;
        suggestion.SortOrder = request.SortOrder;

        await db.SaveChangesAsync(cancellationToken);
        return Ok(ToDto(suggestion));
    }

    [HttpPatch("{id:guid}/active")]
    [Authorize(Roles = Roles.Admin)]
    public async Task<IActionResult> SetActive(
        Guid id,
        [FromBody] SetThankYouSuggestionActiveRequest request,
        CancellationToken cancellationToken)
    {
        var suggestion = await db.ThankYouSuggestions.FirstOrDefaultAsync(s => s.Id == id, cancellationToken);
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
        var suggestion = await db.ThankYouSuggestions.FirstOrDefaultAsync(s => s.Id == id, cancellationToken);
        if (suggestion is null)
        {
            return NotFound();
        }

        db.ThankYouSuggestions.Remove(suggestion);
        await db.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    private static ThankYouSuggestionDto ToDto(ThankYouSuggestion s) => new()
    {
        Id = s.Id.ToString().ToLowerInvariant(),
        Label = s.Label,
        ImageUrl = s.ImageUrl,
        IsActive = s.IsActive,
        SortOrder = s.SortOrder,
    };
}
