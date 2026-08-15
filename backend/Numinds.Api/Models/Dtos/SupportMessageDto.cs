namespace Numinds.Api.Models.Dtos;

// Mirrors src/types/api.ts -> SupportMessageDto.
public class SupportMessageDto
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public DateTime ReceivedAt { get; set; }
    public bool Read { get; set; }
}

// POST /api/support-messages — public submission (ContactUsView.tsx's form).
public class SupportMessageSubmissionRequest
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
}
