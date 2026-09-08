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
        CancellationToken cancellationToken);
}
