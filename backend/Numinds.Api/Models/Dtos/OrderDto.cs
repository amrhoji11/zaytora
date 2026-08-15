namespace Numinds.Api.Models.Dtos;

// Mirrors src/types/api.ts -> OrderDto.
public class OrderDto
{
    public string Id { get; set; } = string.Empty;
    public string InvitationId { get; set; } = string.Empty;
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerEmail { get; set; } = string.Empty;
    public bool QrEnabled { get; set; }
    public int? QrGuestCount { get; set; }
    public bool GiftFeeCoverage { get; set; }
    public string? PromoCodeUsed { get; set; }
    public decimal AmountUsd { get; set; }
    public string Currency { get; set; } = "USD";
    public decimal ConvertedAmount { get; set; }
    public string PaymentStatus { get; set; } = "pending";
    public string? AdminNote { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? PaidAt { get; set; }

    // Denormalized for the admin orders table, same reasoning as
    // InvitationSummaryDto — avoids a second round trip per row.
    public string? InvitationEditUrl { get; set; }
    public string? TemplateCode { get; set; }
}

// POST /api/orders — creates a pending order for one invitation. The server
// computes AmountUsd itself from PricingSettings + any promo code; Currency/
// ConvertedAmount are only what was shown to the customer, for the receipt.
public class CreateOrderRequest
{
    public string InvitationId { get; set; } = string.Empty;
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerEmail { get; set; } = string.Empty;
    public bool EnableQrEntry { get; set; }
    public int? QrGuestCount { get; set; }
    public bool EnableGifts { get; set; }
    public bool GiftFeeCoverage { get; set; }
    public string? PromoCode { get; set; }
    public string Currency { get; set; } = "USD";
    public decimal ConvertedAmount { get; set; }
}

// The full response to POST /api/orders — bundles the receiving-account
// details in with the created order so the confirmation screen can render
// immediately, no second request needed.
public class OrderCreatedResponse
{
    public OrderDto Order { get; set; } = new();
    public PaymentSettingsDto PaymentSettings { get; set; } = new();
}

public class UpdateOrderStatusRequest
{
    public string Status { get; set; } = string.Empty; // "paid" | "failed"
    public string? AdminNote { get; set; }
}
