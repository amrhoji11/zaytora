namespace Numinds.Api.Services;

public interface IMetaConversionsApiService
{
    // Reports a new-account signup to Meta server-side (Conversions API),
    // independent of the browser Pixel -- doesn't rely on the visitor's
    // browser having actually loaded/run the client-side script. Never
    // throws: a failed or unconfigured send must never block the real
    // signup it's reporting on.
    Task SendCompleteRegistrationAsync(
        string email,
        string? clientIpAddress,
        string? userAgent,
        string eventSourceUrl,
        string? fbc,
        string? fbp,
        CancellationToken cancellationToken);

    // Reports a confirmed sale the moment an admin manually marks an order
    // "paid" (see OrdersController.UpdateStatus -- there's no payment
    // gateway, an admin reconciles an out-of-band bank transfer by hand).
    // There is deliberately no client-side Pixel Purchase event to pair
    // this with: the customer isn't present in a browser session when
    // their transfer finally clears, often hours or days after checkout.
    Task SendPurchaseAsync(
        string orderId,
        string customerEmail,
        decimal valueUsd,
        string eventSourceUrl,
        CancellationToken cancellationToken);

    // Server-side backstop for the client Pixel's own PageView -- ad
    // blockers and browser tracking protection silently drop the Pixel for
    // a meaningful share of real visitors, and those visits are otherwise
    // invisible to Meta entirely. eventId must be the exact same id the
    // client passed to fbq('track', 'PageView', {}, {eventID}) so Meta
    // deduplicates the two into one event instead of double-counting a
    // visitor whose Pixel did fire.
    Task SendPageViewAsync(
        string eventId,
        string eventSourceUrl,
        string? clientIpAddress,
        string? userAgent,
        string? fbc,
        string? fbp,
        CancellationToken cancellationToken);
}
