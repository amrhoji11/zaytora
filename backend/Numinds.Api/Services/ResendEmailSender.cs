using System.Net.Http.Json;

namespace Numinds.Api.Services;

// Thin wrapper around Resend's HTTP API (https://resend.com/docs/api-reference/emails/send-email).
// Email:Resend:ApiKey isn't configured yet — until it is, sends are skipped
// with a warning log instead of throwing, so forgot-password keeps returning
// its normal (enumeration-safe) 204 while the key is still being set up.
public class ResendEmailSender(HttpClient httpClient, IConfiguration configuration, ILogger<ResendEmailSender> logger) : IEmailSender
{
    public async Task SendAsync(string to, string subject, string htmlBody, CancellationToken cancellationToken = default)
    {
        var apiKey = configuration["Email:Resend:ApiKey"];
        if (string.IsNullOrWhiteSpace(apiKey))
        {
            // Logged in full (not just skipped silently) so a dev without a
            // Resend key yet can still copy the link out of the console.
            logger.LogWarning(
                "Email:Resend:ApiKey is not configured - skipping email to {To} ({Subject}):\n{Body}",
                to, subject, htmlBody);
            return;
        }

        var from = configuration["Email:Resend:FromAddress"] ?? "Zaytora <onboarding@resend.dev>";

        using var request = new HttpRequestMessage(HttpMethod.Post, "https://api.resend.com/emails");
        request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", apiKey);
        request.Content = JsonContent.Create(new { from, to = new[] { to }, subject, html = htmlBody });

        var response = await httpClient.SendAsync(request, cancellationToken);
        if (!response.IsSuccessStatusCode)
        {
            var body = await response.Content.ReadAsStringAsync(cancellationToken);
            logger.LogError("Resend send to {To} failed ({Status}): {Body}", to, response.StatusCode, body);
        }
    }
}
