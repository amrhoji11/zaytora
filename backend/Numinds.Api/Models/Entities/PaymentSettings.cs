namespace Numinds.Api.Models.Entities;

// Singleton row (exactly one, seeded empty — see NumindsDbContext.OnModelCreating)
// holding the admin's own account details for receiving manual payments —
// there is no live payment gateway integration, so checkout works by
// showing the customer this account and asking them to transfer the amount
// themselves; the admin then manually marks the order paid once confirmed.
// Deliberately never stores a CVV or expiry date — those are only needed to
// charge a card, not to receive a transfer into one, and storing them would
// be an unnecessary liability.
public class PaymentSettings
{
    public Guid Id { get; set; }

    public string RecipientName { get; set; } = string.Empty;
    public string AccountNumber { get; set; } = string.Empty;
    public string? BankName { get; set; }
    public string? Iban { get; set; }

    // Free text the admin can customize, e.g. "أرسل لقطة شاشة للتحويل عبر واتساب".
    public string? Instructions { get; set; }
}
