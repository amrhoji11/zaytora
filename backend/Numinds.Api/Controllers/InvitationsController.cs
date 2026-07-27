using System.Text.Json;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Numinds.Api.Data;
using Numinds.Api.Models.Dtos;
using Numinds.Api.Models.Entities;

namespace Numinds.Api.Controllers;

[ApiController]
[Route("api/invitations")]
public class InvitationsController(
    NumindsDbContext db,
    UserManager<ApplicationUser> userManager) : ControllerBase
{
    // POST /api/invitations
    // Anonymous is allowed: the Hero "إنشاء دعوة" CTA can create a draft
    // before the user has an account. If a session cookie is present the
    // draft is associated with that user instead.
    [HttpPost]
    public async Task<ActionResult<InvitationDto>> Create(
        CreateInvitationRequest request,
        CancellationToken cancellationToken)
    {
        var templateId = await ResolveTemplateIdAsync(request.TemplateId, cancellationToken);
        if (templateId is null && !string.IsNullOrWhiteSpace(request.TemplateId))
        {
            return BadRequest(new { title = $"Unknown templateId '{request.TemplateId}'." });
        }

        var userId = await GetCurrentUserIdAsync();

        var invitation = new Invitation
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            TemplateId = templateId,
            Status = "draft",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };

        db.Invitations.Add(invitation);
        await db.SaveChangesAsync(cancellationToken);

        var dto = new InvitationDto
        {
            Id = invitation.Id.ToString(),
            Status = invitation.Status,
            EditUrl = $"/studio?invitationId={invitation.Id}",
        };

        return CreatedAtAction(nameof(GetById), new { id = invitation.Id }, dto);
    }

    // GET /api/invitations/{id}
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<InvitationDetailDto>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var invitation = await db.Invitations.AsNoTracking().FirstOrDefaultAsync(i => i.Id == id, cancellationToken);
        if (invitation is null)
        {
            return NotFound();
        }

        return Ok(ToDetailDto(invitation));
    }

    // PUT /api/invitations/{id}
    // Patch semantics: only properties present (non-null) in the request
    // body are applied, so each wizard step can save just the fields it
    // owns without resending the whole accumulated invitation.
    [HttpPut("{id:guid}")]
    public async Task<ActionResult<InvitationDetailDto>> Update(
        Guid id,
        UpdateInvitationRequest request,
        CancellationToken cancellationToken)
    {
        var invitation = await db.Invitations.FirstOrDefaultAsync(i => i.Id == id, cancellationToken);
        if (invitation is null)
        {
            return NotFound();
        }

        if (request.TemplateId is not null)
        {
            var templateId = await ResolveTemplateIdAsync(request.TemplateId, cancellationToken);
            if (templateId is null)
            {
                return BadRequest(new { title = $"Unknown templateId '{request.TemplateId}'." });
            }
            invitation.TemplateId = templateId;
        }

        if (request.Status is not null) invitation.Status = request.Status;

        if (request.Language is not null) invitation.Language = request.Language;

        if (request.OccasionType is not null) invitation.OccasionType = request.OccasionType;
        if (request.IsCoupleEvent is not null) invitation.IsCoupleEvent = request.IsCoupleEvent.Value;

        if (request.EventTitle is not null) invitation.EventTitle = request.EventTitle;
        if (request.EventTitleFont is not null) invitation.EventTitleFont = request.EventTitleFont;
        if (request.InvitationType is not null) invitation.InvitationType = request.InvitationType;
        if (request.FirstName is not null) invitation.FirstName = request.FirstName;
        if (request.SecondName is not null) invitation.SecondName = request.SecondName;
        if (request.NamesFont is not null) invitation.NamesFont = request.NamesFont;
        if (request.UseNameImage is not null) invitation.UseNameImage = request.UseNameImage.Value;
        if (request.EventDateTime is not null) invitation.EventDateTime = request.EventDateTime;
        if (request.Timezone is not null) invitation.Timezone = request.Timezone;
        if (request.UseHijriDate is not null) invitation.UseHijriDate = request.UseHijriDate.Value;
        if (request.ThankYouText is not null) invitation.ThankYouText = request.ThankYouText;
        if (request.ThankYouTextColor is not null) invitation.ThankYouTextColor = request.ThankYouTextColor;

        if (request.HideFamilyNames is not null) invitation.HideFamilyNames = request.HideFamilyNames.Value;
        if (request.FamilyName1 is not null) invitation.FamilyName1 = request.FamilyName1;
        if (request.FamilyName2 is not null) invitation.FamilyName2 = request.FamilyName2;
        if (request.FamilyNamesFont is not null) invitation.FamilyNamesFont = request.FamilyNamesFont;
        if (request.InvitationText is not null) invitation.InvitationText = request.InvitationText;

        if (request.Venues is not null) invitation.VenuesJson = JsonSerializer.Serialize(request.Venues);

        if (request.ShowEventProgram is not null) invitation.ShowEventProgram = request.ShowEventProgram.Value;
        if (request.ProgramItems is not null) invitation.ProgramItemsJson = JsonSerializer.Serialize(request.ProgramItems);

        if (request.ShowEventRules is not null) invitation.ShowEventRules = request.ShowEventRules.Value;
        if (request.EventRulesText is not null) invitation.EventRulesText = request.EventRulesText;

        if (request.ShowAccommodation is not null) invitation.ShowAccommodation = request.ShowAccommodation.Value;
        if (request.Accommodations is not null) invitation.AccommodationsJson = JsonSerializer.Serialize(request.Accommodations);

        if (request.GalleryImages is not null) invitation.GalleryImagesJson = JsonSerializer.Serialize(request.GalleryImages);

        if (request.ShowPersonalMessage is not null) invitation.ShowPersonalMessage = request.ShowPersonalMessage.Value;
        if (request.PersonalMessageTitle is not null) invitation.PersonalMessageTitle = request.PersonalMessageTitle;
        if (request.PersonalMessageText is not null) invitation.PersonalMessageText = request.PersonalMessageText;
        if (request.PersonalMessageSignature is not null) invitation.PersonalMessageSignature = request.PersonalMessageSignature;

        if (request.Contacts is not null) invitation.ContactsJson = JsonSerializer.Serialize(request.Contacts);

        if (request.MusicUrl is not null) invitation.MusicUrl = request.MusicUrl;
        if (request.MusicTitle is not null) invitation.MusicTitle = request.MusicTitle;

        if (request.EnableGifts is not null) invitation.EnableGifts = request.EnableGifts.Value;
        if (request.GiftIban is not null) invitation.GiftIban = request.GiftIban;

        if (request.HideCameraButton is not null) invitation.HideCameraButton = request.HideCameraButton.Value;
        if (request.HideSaveButton is not null) invitation.HideSaveButton = request.HideSaveButton.Value;
        if (request.HideCapturedGallery is not null) invitation.HideCapturedGallery = request.HideCapturedGallery.Value;

        if (request.EnableQrEntry is not null) invitation.EnableQrEntry = request.EnableQrEntry.Value;

        if (request.EnableRsvp is not null) invitation.EnableRsvp = request.EnableRsvp.Value;
        if (request.RsvpShowAttendance is not null) invitation.RsvpShowAttendance = request.RsvpShowAttendance.Value;
        if (request.RsvpShowGuestCount is not null) invitation.RsvpShowGuestCount = request.RsvpShowGuestCount.Value;
        if (request.RsvpShowMessage is not null) invitation.RsvpShowMessage = request.RsvpShowMessage.Value;
        if (request.RsvpShowLiveCount is not null) invitation.RsvpShowLiveCount = request.RsvpShowLiveCount.Value;
        if (request.GuestLimit is not null) invitation.GuestLimit = request.GuestLimit;

        if (request.GeneralTextFont is not null) invitation.GeneralTextFont = request.GeneralTextFont;
        if (request.EnvelopeNameFont is not null) invitation.EnvelopeNameFont = request.EnvelopeNameFont;

        invitation.UpdatedAt = DateTime.UtcNow;

        await db.SaveChangesAsync(cancellationToken);

        return Ok(ToDetailDto(invitation));
    }

    private async Task<Guid?> ResolveTemplateIdAsync(string? templateId, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(templateId)) return null;
        if (!Guid.TryParse(templateId, out var parsed)) return null;

        var exists = await db.Templates.AnyAsync(t => t.Id == parsed, cancellationToken);
        return exists ? parsed : null;
    }

    private async Task<Guid?> GetCurrentUserIdAsync()
    {
        if (User.Identity?.IsAuthenticated != true) return null;
        var user = await userManager.GetUserAsync(User);
        return user?.Id;
    }

    private static List<T> Deserialize<T>(string json) =>
        JsonSerializer.Deserialize<List<T>>(json) ?? [];

    private static InvitationDetailDto ToDetailDto(Invitation invitation) => new()
    {
        Id = invitation.Id.ToString(),
        Status = invitation.Status,
        EditUrl = $"/studio?invitationId={invitation.Id}",
        TemplateId = invitation.TemplateId?.ToString(),
        CreatedAt = invitation.CreatedAt,
        UpdatedAt = invitation.UpdatedAt,

        Language = invitation.Language,

        OccasionType = invitation.OccasionType,
        IsCoupleEvent = invitation.IsCoupleEvent,

        EventTitle = invitation.EventTitle,
        EventTitleFont = invitation.EventTitleFont,
        InvitationType = invitation.InvitationType,
        FirstName = invitation.FirstName,
        SecondName = invitation.SecondName,
        NamesFont = invitation.NamesFont,
        UseNameImage = invitation.UseNameImage,
        EventDateTime = invitation.EventDateTime,
        Timezone = invitation.Timezone,
        UseHijriDate = invitation.UseHijriDate,
        ThankYouText = invitation.ThankYouText,
        ThankYouTextColor = invitation.ThankYouTextColor,

        HideFamilyNames = invitation.HideFamilyNames,
        FamilyName1 = invitation.FamilyName1,
        FamilyName2 = invitation.FamilyName2,
        FamilyNamesFont = invitation.FamilyNamesFont,
        InvitationText = invitation.InvitationText,

        Venues = Deserialize<VenueItemDto>(invitation.VenuesJson),

        ShowEventProgram = invitation.ShowEventProgram,
        ProgramItems = Deserialize<ProgramItemDto>(invitation.ProgramItemsJson),

        ShowEventRules = invitation.ShowEventRules,
        EventRulesText = invitation.EventRulesText,

        ShowAccommodation = invitation.ShowAccommodation,
        Accommodations = Deserialize<VenueItemDto>(invitation.AccommodationsJson),

        GalleryImages = Deserialize<string>(invitation.GalleryImagesJson),

        ShowPersonalMessage = invitation.ShowPersonalMessage,
        PersonalMessageTitle = invitation.PersonalMessageTitle,
        PersonalMessageText = invitation.PersonalMessageText,
        PersonalMessageSignature = invitation.PersonalMessageSignature,

        Contacts = Deserialize<ContactItemDto>(invitation.ContactsJson),

        MusicUrl = invitation.MusicUrl,
        MusicTitle = invitation.MusicTitle,

        EnableGifts = invitation.EnableGifts,
        GiftIban = invitation.GiftIban,

        HideCameraButton = invitation.HideCameraButton,
        HideSaveButton = invitation.HideSaveButton,
        HideCapturedGallery = invitation.HideCapturedGallery,

        EnableQrEntry = invitation.EnableQrEntry,

        EnableRsvp = invitation.EnableRsvp,
        RsvpShowAttendance = invitation.RsvpShowAttendance,
        RsvpShowGuestCount = invitation.RsvpShowGuestCount,
        RsvpShowMessage = invitation.RsvpShowMessage,
        RsvpShowLiveCount = invitation.RsvpShowLiveCount,
        GuestLimit = invitation.GuestLimit,

        GeneralTextFont = invitation.GeneralTextFont,
        EnvelopeNameFont = invitation.EnvelopeNameFont,
    };
}
