namespace Numinds.Api.Models.Entities;

// One WhatsApp entry in ContactSettings' channel list (the reference design
// shows a Saudi and a UK number side by side) — a child list rather than
// fixed columns so an admin can add/remove numbers (e.g. a Palestine number)
// without a schema change.
public class ContactWhatsAppNumber
{
    public Guid Id { get; set; }
    public Guid ContactSettingsId { get; set; }

    // ISO 3166-1 alpha-2 (e.g. "SA", "GB") — the frontend derives both the
    // flag emoji and the "WHATSAPP SA" label from this, so it never drifts
    // out of sync with the number's actual flag.
    public string CountryCode { get; set; } = string.Empty;

    public string PhoneNumber { get; set; } = string.Empty;

    // Display order — ContactSettingsController.Update rewrites this from
    // the admin form's submitted array order on every save.
    public int SortOrder { get; set; }
}
