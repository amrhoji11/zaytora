namespace Numinds.Api.Models.Dtos;

// Mirrors src/types/api.ts -> ContactSettingsDto (System.Text.Json defaults to camelCase).
public class ContactSettingsDto
{
    public string Email { get; set; } = string.Empty;
    public string? SecondaryEmail { get; set; }
    public string ResponseTimeText { get; set; } = string.Empty;
    public string AvailabilityText { get; set; } = string.Empty;
    public bool AvailableWorldwide { get; set; }
    public string? InstagramUrl { get; set; }
    public string? TikTokUrl { get; set; }
    public List<ContactWhatsAppNumberDto> WhatsAppNumbers { get; set; } = new();
}

public class ContactWhatsAppNumberDto
{
    public string CountryCode { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
}

// Payload for PUT /api/contact-settings — replaces the singleton row and its
// whole WhatsAppNumbers list in one submit (see ContactSettingsController.Update).
public class ContactSettingsWriteRequest
{
    public string Email { get; set; } = string.Empty;
    public string? SecondaryEmail { get; set; }
    public string ResponseTimeText { get; set; } = string.Empty;
    public string AvailabilityText { get; set; } = string.Empty;
    public bool AvailableWorldwide { get; set; }
    public string? InstagramUrl { get; set; }
    public string? TikTokUrl { get; set; }
    public List<ContactWhatsAppNumberDto> WhatsAppNumbers { get; set; } = new();
}
