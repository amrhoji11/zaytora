using Amazon.S3;
using Amazon.S3.Model;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Jpeg;
using SixLabors.ImageSharp.Formats.Png;
using SixLabors.ImageSharp.Formats.Webp;
using SixLabors.ImageSharp.Processing;

namespace Numinds.Api.Services;

// Uploads admin-submitted images (partner logos, template covers, envelope
// photos, thank-you-suggestion cards) to Cloudflare R2 instead of local
// disk. Render's filesystem is ephemeral -- anything written under wwwroot
// at runtime is wiped on the next deploy/restart, which is exactly what
// silently broke an already-approved partner's logo: the URL was still
// sitting in the database, but the file itself was gone (404) the first
// time the backend redeployed after it was uploaded.
//
// Falls back to the old local-disk behavior, with a warning logged, if R2
// isn't configured yet (Storage:R2:* keys) -- same "degrade instead of
// crash" pattern ResendEmailSender uses when Email:Resend:ApiKey is unset,
// so upload endpoints keep working right up until R2 credentials are added.
public class R2FileStorageService(
    IConfiguration configuration,
    IWebHostEnvironment env,
    ILogger<R2FileStorageService> logger) : IFileStorageService
{
    // Longest side an uploaded image is ever allowed to keep. Every caller
    // (template covers, envelope photos, partner logos, thank-you cards,
    // captured photos) displays at well under this, so anything above it is
    // pure wasted storage/transfer rather than real visual quality.
    private const int MaxImageDimension = 2000;

    public async Task<string> UploadAsync(
        IFormFile file,
        string folder,
        string extension,
        string fallbackBaseUrl,
        CancellationToken cancellationToken)
    {
        var fileName = $"{Guid.NewGuid()}{extension}";

        byte[] originalBytes;
        await using (var input = file.OpenReadStream())
        {
            using var buffer = new MemoryStream();
            await input.CopyToAsync(buffer, cancellationToken);
            originalBytes = buffer.ToArray();
        }

        var compressed = TryCompressImage(originalBytes, file.ContentType);
        var uploadBytes = compressed ?? originalBytes;

        var accountId = configuration["Storage:R2:AccountId"];
        var accessKey = configuration["Storage:R2:AccessKeyId"];
        var secretKey = configuration["Storage:R2:SecretAccessKey"];
        var bucket = configuration["Storage:R2:BucketName"];
        var publicBaseUrl = configuration["Storage:R2:PublicBaseUrl"];

        if (string.IsNullOrWhiteSpace(accountId) || string.IsNullOrWhiteSpace(accessKey) ||
            string.IsNullOrWhiteSpace(secretKey) || string.IsNullOrWhiteSpace(bucket) ||
            string.IsNullOrWhiteSpace(publicBaseUrl))
        {
            logger.LogWarning(
                "Storage:R2 is not fully configured - saving {Folder}/{FileName} to local disk instead. " +
                "This file will NOT survive the next deploy/restart.",
                folder, fileName);
            return await SaveToLocalDiskAsync(uploadBytes, folder, fileName, fallbackBaseUrl, cancellationToken);
        }

        using var client = new AmazonS3Client(
            accessKey,
            secretKey,
            new AmazonS3Config
            {
                ServiceURL = $"https://{accountId}.r2.cloudflarestorage.com",
                ForcePathStyle = true,
                // AWSSDK.S3 v4 defaults PutObject to a chunked, trailer-checksum
                // upload encoding ("STREAMING-AWS4-HMAC-SHA256-PAYLOAD-TRAILER")
                // that R2's S3-compatible API doesn't implement, failing every
                // upload with AmazonS3Exception("...PAYLOAD-TRAILER not
                // implemented"). Opting both back to computing/checking a
                // checksum only when the API actually requires one restores the
                // plain signing R2 supports.
                RequestChecksumCalculation = Amazon.Runtime.RequestChecksumCalculation.WHEN_REQUIRED,
                ResponseChecksumValidation = Amazon.Runtime.ResponseChecksumValidation.WHEN_REQUIRED,
            });

        await using var stream = new MemoryStream(uploadBytes);
        await client.PutObjectAsync(
            new PutObjectRequest
            {
                BucketName = bucket,
                Key = $"{folder}/{fileName}",
                InputStream = stream,
                ContentType = file.ContentType,
                // Every upload gets a fresh GUID-based key and is never
                // overwritten in place (a "replace" is really a new upload +
                // the old key being deleted separately, see DeleteAsync) --
                // so it's safe to cache these as immutable for a full year
                // instead of the CDN/browser re-fetching the same bytes from
                // R2 on every single view.
                Headers = { CacheControl = "public, max-age=31536000, immutable" },
                // Beyond the checksum trailer above, the SDK still defaults to
                // a *chunked* signed-payload upload ("STREAMING-AWS4-HMAC-
                // SHA256-PAYLOAD") that R2 doesn't implement in any form --
                // only a single upfront signature over the whole body. This
                // forces that plain mode.
                DisablePayloadSigning = true,
            },
            cancellationToken);

        return $"{publicBaseUrl.TrimEnd('/')}/{folder}/{fileName}";
    }

    // Downscales oversized images and re-encodes them at a slightly lossy
    // quality (same format in, same format out -- so a transparent PNG logo
    // stays a PNG, never silently becomes an opaque JPEG). Returns null
    // (upload the original bytes untouched) for any content type it doesn't
    // recognize, or if compression didn't actually help, or if anything
    // about the image is malformed enough to throw -- compression is a
    // nice-to-have and must never be the reason an upload fails.
    private byte[]? TryCompressImage(byte[] originalBytes, string contentType)
    {
        try
        {
            using var image = Image.Load(originalBytes);

            if (image.Width > MaxImageDimension || image.Height > MaxImageDimension)
            {
                image.Mutate(x => x.Resize(new ResizeOptions
                {
                    Mode = ResizeMode.Max,
                    Size = new Size(MaxImageDimension, MaxImageDimension),
                }));
            }

            using var output = new MemoryStream();
            switch (contentType)
            {
                case "image/jpeg":
                    image.SaveAsJpeg(output, new JpegEncoder { Quality = 82 });
                    break;
                case "image/webp":
                    image.SaveAsWebp(output, new WebpEncoder { Quality = 82 });
                    break;
                case "image/png":
                    image.SaveAsPng(output, new PngEncoder { CompressionLevel = PngCompressionLevel.BestCompression });
                    break;
                default:
                    return null;
            }

            var compressedBytes = output.ToArray();
            return compressedBytes.Length < originalBytes.Length ? compressedBytes : null;
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Failed to compress an uploaded image -- uploading the original bytes instead.");
            return null;
        }
    }

    public async Task DeleteAsync(string? url, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(url))
        {
            return;
        }

        var accountId = configuration["Storage:R2:AccountId"];
        var accessKey = configuration["Storage:R2:AccessKeyId"];
        var secretKey = configuration["Storage:R2:SecretAccessKey"];
        var bucket = configuration["Storage:R2:BucketName"];
        var publicBaseUrl = configuration["Storage:R2:PublicBaseUrl"];

        if (string.IsNullOrWhiteSpace(accountId) || string.IsNullOrWhiteSpace(accessKey) ||
            string.IsNullOrWhiteSpace(secretKey) || string.IsNullOrWhiteSpace(bucket) ||
            string.IsNullOrWhiteSpace(publicBaseUrl))
        {
            return;
        }

        var prefix = publicBaseUrl.TrimEnd('/') + "/";
        if (!url.StartsWith(prefix, StringComparison.Ordinal))
        {
            // Not an R2-hosted file (base64 data: URL, local-disk fallback
            // URL, or some other external URL) -- nothing to delete.
            return;
        }

        var key = url[prefix.Length..];

        try
        {
            using var client = new AmazonS3Client(
                accessKey,
                secretKey,
                new AmazonS3Config
                {
                    ServiceURL = $"https://{accountId}.r2.cloudflarestorage.com",
                    ForcePathStyle = true,
                });

            await client.DeleteObjectAsync(bucket, key, cancellationToken);
        }
        catch (Exception ex)
        {
            // Best-effort cleanup -- a failed delete must never fail the
            // caller's actual operation (a template save, an invitation
            // delete, etc). Worst case a file lingers in R2 for later
            // manual cleanup instead of the whole request 500ing.
            logger.LogWarning(ex, "Failed to delete {Key} from R2.", key);
        }
    }

    private async Task<string> SaveToLocalDiskAsync(
        byte[] bytes, string folder, string fileName, string fallbackBaseUrl, CancellationToken cancellationToken)
    {
        var webRoot = env.WebRootPath ?? Path.Combine(env.ContentRootPath, "wwwroot");
        var uploadsDir = Path.Combine(webRoot, "uploads", folder);
        Directory.CreateDirectory(uploadsDir);

        var filePath = Path.Combine(uploadsDir, fileName);
        await System.IO.File.WriteAllBytesAsync(filePath, bytes, cancellationToken);

        return $"{fallbackBaseUrl.TrimEnd('/')}/uploads/{folder}/{fileName}";
    }
}
