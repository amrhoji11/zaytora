namespace Numinds.Api.Models.Dtos;

// Not present in src/types/api.ts (the frontend doesn't have a login screen
// yet) — added so /account/me and /account/logout have a way to establish
// a session for manual testing (e.g. via Swagger) against the seeded demo
// user. Wire this up to a real sign-in flow when one exists.
public class LoginRequest
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}
