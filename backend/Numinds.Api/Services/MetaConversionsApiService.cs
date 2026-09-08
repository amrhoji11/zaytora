using System.Net.Http.Json;
using System.Security.Cryptography;
using System.Text;

namespace Numinds.Api.Services;

// Server-side half of the Meta Pixel (see MetaPixel.tsx on the frontend) --
// reports the same signup as a "CompleteRegistration" event straight to
// Meta's Graph API, so it's still counted even when a visitor's browser
// never ran the client-side pixel (ad blocker, tracking protection, JS
// disabled). Meta:PixelId/Meta:ConversionsApiAccessToken aren't configured
// yet -- until they are, sends are skipped with a warning log, same
// "degrade instead of crash" pattern as ResendEmailSender above.
public class MetaConversionsApiService(
    HttpClient httpClient,
    IConfiguration configuration,
    ILogger<MetaConversionsApiService> logger) : IMetaConversionsApiService
{
    private const string GraphApiVersion = "v21.0";

    public async Task SendCompleteRegistrationAsync(
        string email,
        string? clientIpAddress,
        string? userAgent,
        CancellationToken cancellationToken)
    {
        var pixelId = configuration["Meta:PixelId"];
        var accessToken = configuration["Meta:ConversionsApiAccessToken"];
        if (string.IsNullOrWhiteSpace(pixelId) || string.IsNullOrWhiteSpace(accessToken))
        {
            logger.LogWarning(
                "Meta:PixelId/Meta:ConversionsApiAccessToken are not configured - skipping " +
                "CompleteRegistration Conversions API event for {Email}.",
                email);
            return;
        }

        // Meta requires user_data identifiers (email included) to arrive
        // pre-hashed -- lowercase+trim first since the hash is otherwise
        // sensitive to casing/whitespace a real user's input commonly varies
        // by, which would silently degrade match quality for no reason.
        var hashedEmail = Sha256Hex(email.Trim().ToLowerInvariant());

        var userData = new Dictionary<string, object>
        {
            ["em"] = new[] { hashedEmail },
        };
        if (!string.IsNullOrWhiteSpace(clientIpAddress))
        {
            userData["client_ip_address"] = clientIpAddress;
        }
        if (!string.IsNullOrWhiteSpace(userAgent))
        {
            userData["client_user_agent"] = userAgent;
        }

        var eventPayload = new Dictionary<string, object>
        {
            ["event_name"] = "CompleteRegistration",
            ["event_time"] = DateTimeOffset.UtcNow.ToUnixTimeSeconds(),
            ["action_source"] = "website",
            ["user_data"] = userData,
        };

        var body = new Dictionary<string, object>
        {
            ["data"] = new[] { eventPayload },
        };
        // Lets the admin verify real events in Events Manager's Test Events
        // tab before trusting the integration -- unset in normal production
        // use (Meta:TestEventCode absent), where events count as real.
        var testEventCode = configuration["Meta:TestEventCode"];
        if (!string.IsNullOrWhiteSpace(testEventCode))
        {
            body["test_event_code"] = testEventCode;
        }

        try
        {
            var url = $"https://graph.facebook.com/{GraphApiVersion}/{pixelId}/events?access_token={Uri.EscapeDataString(accessToken)}";
            var response = await httpClient.PostAsJsonAsync(url, body, cancellationToken);
            if (!response.IsSuccessStatusCode)
            {
                var responseBody = await response.Content.ReadAsStringAsync(cancellationToken);
                logger.LogError(
                    "Meta Conversions API CompleteRegistration send failed ({Status}): {Body}",
                    response.StatusCode, responseBody);
            }
        }
        catch (Exception ex)
        {
            // Best-effort -- a network blip or Meta-side outage here must
            // never fail the actual account registration it's reporting on.
            logger.LogError(ex, "Meta Conversions API CompleteRegistration send threw for {Email}.", email);
        }
    }

    private static string Sha256Hex(string value)
    {
        var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(value));
        var builder = new StringBuilder(bytes.Length * 2);
        foreach (var b in bytes)
        {
            builder.Append(b.ToString("x2"));
        }
        return builder.ToString();
    }
}
