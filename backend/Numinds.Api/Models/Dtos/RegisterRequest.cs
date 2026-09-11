namespace Numinds.Api.Models.Dtos;

// Body for POST /api/account/register.
public class RegisterRequest
{
    public string DisplayName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }

    // Meta's _fbc/_fbp cookies, read client-side and forwarded here so the
    // server-side Conversions API event can include them for better event
    // match quality -- see MetaConversionsApiService.
    public string? Fbc { get; set; }
    public string? Fbp { get; set; }
}
