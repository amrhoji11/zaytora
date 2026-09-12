using System.Net.Http.Json;
using System.Security.Cryptography;
using System.Text;

namespace Numinds.Api.Services;

// Server-side complement to the frontend's Meta Pixel (see MetaPixel.tsx) --
// reports events straight to Meta's Graph API so they're still counted even
// when a visitor's browser never ran the client-side pixel (ad blocker,
// tracking protection, JS disabled), and covers events with no browser
// session to fire from at all (see SendPurchaseAsync). Meta:PixelId/
// Meta:ConversionsApiAccessToken aren't configured yet -- until they are,
// sends are skipped with a warning log, same "degrade instead of crash"
// pattern as ResendEmailSender.
public class MetaConversionsApiService(
    HttpClient httpClient,
    IConfiguration configuration,
    ILogger<MetaConversionsApiService> logger) : IMetaConversionsApiService
{
    private const string GraphApiVersion = "v21.0";

    public Task SendCompleteRegistrationAsync(
        string email,
        string? clientIpAddress,
        string? userAgent,
        string eventSourceUrl,
        string? fbc,
        string? fbp,
        CancellationToken cancellationToken)
    {
        var userData = BuildUserData(email, clientIpAddress, userAgent, fbc, fbp);
        return SendEventAsync("CompleteRegistration", userData, customData: null, actionSource: "website", eventSourceUrl, eventId: null, logContext: email, cancellationToken);
    }

    public Task SendPurchaseAsync(
        string orderId,
        string customerEmail,
        decimal valueUsd,
        string eventSourceUrl,
        CancellationToken cancellationToken)
    {
        // No client_ip_address/client_user_agent -- this fires from the
        // admin's own confirmation click, not the customer's browser
        // session, so there's nothing genuine to attach here.
        var userData = BuildUserData(customerEmail, clientIpAddress: null, userAgent: null, fbc: null, fbp: null);
        var customData = new Dictionary<string, object>
        {
            ["currency"] = "USD",
            ["value"] = valueUsd,
            ["order_id"] = orderId,
        };
        // "system_generated" (not "website") -- accurately reflects that
        // this event originates from an internal admin action reconciling
        // an out-of-band bank transfer, not a customer's own website visit.
        return SendEventAsync("Purchase", userData, customData, actionSource: "system_generated", eventSourceUrl, eventId: null, logContext: orderId, cancellationToken);
    }

    public Task SendPageViewAsync(
        string eventId,
        string eventSourceUrl,
        string? clientIpAddress,
        string? userAgent,
        string? fbc,
        string? fbp,
        CancellationToken cancellationToken)
    {
        // No email at this point -- this fires on a plain page visit, not a
        // form submission, so there's nothing to hash. IP/UA/fbc/fbp are
        // whatever the visitor's browser actually carries; BuildUserData
        // already tolerates a missing value for any of them.
        var userData = BuildUserData(email: null, clientIpAddress, userAgent, fbc, fbp);
        return SendEventAsync("PageView", userData, customData: null, actionSource: "website", eventSourceUrl, eventId, logContext: eventId, cancellationToken);
    }

    private static Dictionary<string, object> BuildUserData(
        string? email,
        string? clientIpAddress,
        string? userAgent,
        string? fbc,
        string? fbp)
    {
        var userData = new Dictionary<string, object>();
        // Meta requires user_data identifiers to arrive pre-hashed --
        // lowercase+trim first since the hash is otherwise sensitive to
        // casing/whitespace a real user's input commonly varies by, which
        // would silently degrade match quality for no reason. Absent
        // entirely for a plain page visit (SendPageViewAsync), which has no
        // email to hash -- client_ip_address/user_agent/fbc/fbp below are
        // this event's only identifiers.
        if (!string.IsNullOrWhiteSpace(email))
        {
            userData["em"] = new[] { Sha256Hex(email.Trim().ToLowerInvariant()) };
        }
        if (!string.IsNullOrWhiteSpace(clientIpAddress))
        {
            userData["client_ip_address"] = clientIpAddress;
        }
        if (!string.IsNullOrWhiteSpace(userAgent))
        {
            userData["client_user_agent"] = userAgent;
        }
        // fbc/fbp come straight from Meta's own _fbc/_fbp browser cookies --
        // unlike em, they're sent raw, never hashed (Meta's own format).
        if (!string.IsNullOrWhiteSpace(fbc))
        {
            userData["fbc"] = fbc;
        }
        if (!string.IsNullOrWhiteSpace(fbp))
        {
            userData["fbp"] = fbp;
        }
        return userData;
    }

    private async Task SendEventAsync(
        string eventName,
        Dictionary<string, object> userData,
        Dictionary<string, object>? customData,
        string actionSource,
        string eventSourceUrl,
        string? eventId,
        string logContext,
        CancellationToken cancellationToken)
    {
        var pixelId = configuration["Meta:PixelId"];
        var accessToken = configuration["Meta:ConversionsApiAccessToken"];
        if (string.IsNullOrWhiteSpace(pixelId) || string.IsNullOrWhiteSpace(accessToken))
        {
            logger.LogWarning(
                "Meta:PixelId/Meta:ConversionsApiAccessToken are not configured - skipping {EventName} " +
                "Conversions API event for {Context}.",
                eventName, logContext);
            return;
        }

        var eventPayload = new Dictionary<string, object>
        {
            ["event_name"] = eventName,
            ["event_time"] = DateTimeOffset.UtcNow.ToUnixTimeSeconds(),
            ["action_source"] = actionSource,
            ["event_source_url"] = eventSourceUrl,
            ["user_data"] = userData,
        };
        if (customData is not null)
        {
            eventPayload["custom_data"] = customData;
        }
        // Must exactly match the id the client Pixel tagged its own copy of
        // this same event with (see MetaPixel.tsx's PageView eventID) --
        // this is the whole mechanism Meta dedups the pair by instead of
        // double-counting one real visit.
        if (!string.IsNullOrWhiteSpace(eventId))
        {
            eventPayload["event_id"] = eventId;
        }

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
                    "Meta Conversions API {EventName} send failed ({Status}): {Body}",
                    eventName, response.StatusCode, responseBody);
            }
        }
        catch (Exception ex)
        {
            // Best-effort -- a network blip or Meta-side outage here must
            // never fail the real operation (signup, payment confirmation)
            // it's reporting on.
            logger.LogError(ex, "Meta Conversions API {EventName} send threw for {Context}.", eventName, logContext);
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
