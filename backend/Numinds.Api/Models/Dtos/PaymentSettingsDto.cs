namespace Numinds.Api.Models.Dtos;

// Mirrors src/types/api.ts -> PaymentSettingsDto.
public class PaymentSettingsDto
{
    public string RecipientName { get; set; } = string.Empty;
    public string AccountNumber { get; set; } = string.Empty;
    public string? BankName { get; set; }
    public string? Iban { get; set; }
    public string? Instructions { get; set; }
}

public class PaymentSettingsWriteRequest
{
    public string RecipientName { get; set; } = string.Empty;
    public string AccountNumber { get; set; } = string.Empty;
    public string? BankName { get; set; }
    public string? Iban { get; set; }
    public string? Instructions { get; set; }
}
