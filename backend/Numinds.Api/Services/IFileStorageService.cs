namespace Numinds.Api.Services;

public interface IFileStorageService
{
    // folder: e.g. "partners", "templates", "envelopes", "thank-you-suggestions".
    // fallbackBaseUrl: the calling controller's own Request.Scheme+Host,
    // used only if R2 isn't configured (see R2FileStorageService).
    // Returns the final public URL the uploaded file can be fetched from.
    Task<string> UploadAsync(
        IFormFile file,
        string folder,
        string extension,
        string fallbackBaseUrl,
        CancellationToken cancellationToken);

    // Best-effort cleanup for a URL previously returned by UploadAsync.
    // No-ops (never throws) for anything that isn't an R2-hosted file --
    // a base64 data: URL, a local-disk fallback URL, some other external
    // URL, or null/empty -- so every call site can pass whatever URL it
    // has on hand without checking first.
    Task DeleteAsync(string? url, CancellationToken cancellationToken);
}
