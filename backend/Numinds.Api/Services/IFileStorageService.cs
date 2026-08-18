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
}
