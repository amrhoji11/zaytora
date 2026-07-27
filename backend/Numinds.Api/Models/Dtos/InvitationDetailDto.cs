namespace Numinds.Api.Models.Dtos;

// Full read shape for GET /api/invitations/{id} — everything the studio
// wizard needs to resume editing a draft, plus what the live phone
// preview renders.
public class InvitationDetailDto
{
    public string Id { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string EditUrl { get; set; } = string.Empty;
    public string? TemplateId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public string? Language { get; set; }

    public string? OccasionType { get; set; }
    public bool IsCoupleEvent { get; set; }

    public string? EventTitle { get; set; }
    public string? EventTitleFont { get; set; }
    public string InvitationType { get; set; } = "couple";
    public string? FirstName { get; set; }
    public string? SecondName { get; set; }
    public string? NamesFont { get; set; }
    public bool UseNameImage { get; set; }
    public DateTime? EventDateTime { get; set; }
    public string? Timezone { get; set; }
    public bool UseHijriDate { get; set; }
    public string? ThankYouText { get; set; }
    public string? ThankYouTextColor { get; set; }

    public bool HideFamilyNames { get; set; }
    public string? FamilyName1 { get; set; }
    public string? FamilyName2 { get; set; }
    public string? FamilyNamesFont { get; set; }
    public string? InvitationText { get; set; }

    public List<VenueItemDto> Venues { get; set; } = [];

    public bool ShowEventProgram { get; set; }
    public List<ProgramItemDto> ProgramItems { get; set; } = [];

    public bool ShowEventRules { get; set; }
    public string? EventRulesText { get; set; }

    public bool ShowAccommodation { get; set; }
    public List<VenueItemDto> Accommodations { get; set; } = [];

    public List<string> GalleryImages { get; set; } = [];

    public bool ShowPersonalMessage { get; set; }
    public string? PersonalMessageTitle { get; set; }
    public string? PersonalMessageText { get; set; }
    public string? PersonalMessageSignature { get; set; }

    public List<ContactItemDto> Contacts { get; set; } = [];

    public string? MusicUrl { get; set; }
    public string? MusicTitle { get; set; }

    public bool EnableGifts { get; set; }
    public string? GiftIban { get; set; }

    public bool HideCameraButton { get; set; }
    public bool HideSaveButton { get; set; }
    public bool HideCapturedGallery { get; set; }

    public bool EnableQrEntry { get; set; }

    public bool EnableRsvp { get; set; }
    public bool RsvpShowAttendance { get; set; }
    public bool RsvpShowGuestCount { get; set; }
    public bool RsvpShowMessage { get; set; }
    public bool RsvpShowLiveCount { get; set; }
    public int? GuestLimit { get; set; }

    public string? GeneralTextFont { get; set; }
    public string? EnvelopeNameFont { get; set; }
}
