using Amazon.S3;
using Amazon.S3.Model;

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
    public async Task<string> UploadAsync(
        IFormFile file,
        string folder,
        string extension,
        string fallbackBaseUrl,
        CancellationToken cancellationToken)
    {
        var accountId = configuration["Storage:R2:AccountId"];
        var accessKey = configuration["Storage:R2:AccessKeyId"];
        var secretKey = configuration["Storage:R2:SecretAccessKey"];
        var bucket = configuration["Storage:R2:BucketName"];
        var publicBaseUrl = configuration["Storage:R2:PublicBaseUrl"];

        var fileName = $"{Guid.NewGuid()}{extension}";

        if (string.IsNullOrWhiteSpace(accountId) || string.IsNullOrWhiteSpace(accessKey) ||
            string.IsNullOrWhiteSpace(secretKey) || string.IsNullOrWhiteSpace(bucket) ||
            string.IsNullOrWhiteSpace(publicBaseUrl))
        {
            logger.LogWarning(
                "Storage:R2 is not fully configured - saving {Folder}/{FileName} to local disk instead. " +
                "This file will NOT survive the next deploy/restart.",
                folder, fileName);
            return await SaveToLocalDiskAsync(file, folder, fileName, fallbackBaseUrl, cancellationToken);
        }

        using var client = new AmazonS3Client(
            accessKey,
            secretKey,
            new AmazonS3Config
            {
                ServiceURL = $"https://{accountId}.r2.cloudflarestorage.com",
                ForcePathStyle = true,
            });

        await using var stream = file.OpenReadStream();
        await client.PutObjectAsync(
            new PutObjectRequest
            {
                BucketName = bucket,
                Key = $"{folder}/{fileName}",
                InputStream = stream,
                ContentType = file.ContentType,
            },
            cancellationToken);

        return $"{publicBaseUrl.TrimEnd('/')}/{folder}/{fileName}";
    }

    private async Task<string> SaveToLocalDiskAsync(
        IFormFile file, string folder, string fileName, string fallbackBaseUrl, CancellationToken cancellationToken)
    {
        var webRoot = env.WebRootPath ?? Path.Combine(env.ContentRootPath, "wwwroot");
        var uploadsDir = Path.Combine(webRoot, "uploads", folder);
        Directory.CreateDirectory(uploadsDir);

        var filePath = Path.Combine(uploadsDir, fileName);
        await using (var stream = System.IO.File.Create(filePath))
        {
            await file.CopyToAsync(stream, cancellationToken);
        }

        return $"{fallbackBaseUrl.TrimEnd('/')}/uploads/{folder}/{fileName}";
    }
}
