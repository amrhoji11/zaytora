namespace Numinds.Api.Models.Dtos;

// Body for POST /api/account/forgot-password.
public class ForgotPasswordRequest
{
    public string Email { get; set; } = string.Empty;
}
