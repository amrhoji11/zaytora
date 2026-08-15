using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Numinds.Api.Data;
using Numinds.Api.Models;
using Numinds.Api.Models.Dtos;
using Numinds.Api.Models.Entities;

namespace Numinds.Api.Controllers;

// Backs the public /contact-us page and its admin edit form
// (/admin/settings) — a singleton row (see NumindsDbContext's seed data)
// rather than a list, since the site only ever has one contact-info record.
[ApiController]
[Route("api/contact-settings")]
public class ContactSettingsController(NumindsDbContext db) : ControllerBase
{
    // GET /api/contact-settings — public, no id needed.
    [HttpGet]
    public async Task<ActionResult<ContactSettingsDto>> Get(CancellationToken cancellationToken)
    {
        var settings = await db.ContactSettings
            .Include(c => c.WhatsAppNumbers)
            .AsNoTracking()
            .FirstOrDefaultAsync(cancellationToken);

        // Always present via seed data — this null branch only guards against
        // a database that was somehow migrated without seeding.
        if (settings is null)
        {
            return Ok(new ContactSettingsDto());
        }

        return Ok(ToDto(settings, settings.WhatsAppNumbers));
    }

    // PUT /api/contact-settings — admin "Contact Info" form (src/app/admin/settings).
    // Replaces the whole WhatsAppNumbers list wholesale rather than diffing
    // ids, since one form submit is the only way this ever changes.
    [HttpPut]
    [Authorize(Roles = Roles.Admin)]
    public async Task<ActionResult<ContactSettingsDto>> Update(
        [FromBody] ContactSettingsWriteRequest request,
        CancellationToken cancellationToken)
    {
        var settings = await db.ContactSettings
            .Include(c => c.WhatsAppNumbers)
            .FirstOrDefaultAsync(cancellationToken);

        if (settings is null)
        {
            settings = new ContactSettings { Id = Guid.NewGuid() };
            db.ContactSettings.Add(settings);
        }

        settings.Email = request.Email;
        settings.SecondaryEmail = string.IsNullOrWhiteSpace(request.SecondaryEmail) ? null : request.SecondaryEmail;
        settings.ResponseTimeText = request.ResponseTimeText;
        settings.AvailabilityText = request.AvailabilityText;
        settings.AvailableWorldwide = request.AvailableWorldwide;
        settings.InstagramUrl = string.IsNullOrWhiteSpace(request.InstagramUrl) ? null : request.InstagramUrl;
        settings.TikTokUrl = string.IsNullOrWhiteSpace(request.TikTokUrl) ? null : request.TikTokUrl;

        // Going through the DbSet directly (RemoveRange/AddRange) rather than
        // mutating settings.WhatsAppNumbers — a brand-new entity discovered
        // only via a navigation-collection Add(), with its Guid PK already
        // set to a non-default value, can get classified by EF Core's change
        // tracker as Modified ("this might already exist") instead of Added,
        // since IsKeySet-based state inference only reliably says Added for
        // entities reached through the DbSet's own Add/AddRange. That
        // produced an UPDATE against a row that was never inserted — 0 rows
        // affected, DbUpdateConcurrencyException. Explicit DbSet.Add/RemoveRange
        // always force the correct state regardless of that heuristic.
        db.ContactWhatsAppNumbers.RemoveRange(settings.WhatsAppNumbers);

        var newNumbers = request.WhatsAppNumbers
            .Select((w, index) => new ContactWhatsAppNumber
            {
                Id = Guid.NewGuid(),
                ContactSettingsId = settings.Id,
                CountryCode = w.CountryCode,
                PhoneNumber = w.PhoneNumber,
                SortOrder = index,
            })
            .ToList();
        db.ContactWhatsAppNumbers.AddRange(newNumbers);

        await db.SaveChangesAsync(cancellationToken);
        return Ok(ToDto(settings, newNumbers));
    }

    private static ContactSettingsDto ToDto(ContactSettings s, IEnumerable<ContactWhatsAppNumber> whatsAppNumbers) => new()
    {
        Email = s.Email,
        SecondaryEmail = s.SecondaryEmail,
        ResponseTimeText = s.ResponseTimeText,
        AvailabilityText = s.AvailabilityText,
        AvailableWorldwide = s.AvailableWorldwide,
        InstagramUrl = s.InstagramUrl,
        TikTokUrl = s.TikTokUrl,
        WhatsAppNumbers = whatsAppNumbers
            .OrderBy(w => w.SortOrder)
            .Select(w => new ContactWhatsAppNumberDto { CountryCode = w.CountryCode, PhoneNumber = w.PhoneNumber })
            .ToList(),
    };
}
