namespace Numinds.Api.Models.Dtos;

// Mirrors src/types/reviews.ts -> CustomerReview.
public class ReviewDto
{
    public string Id { get; set; } = string.Empty;
    public int Rating { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Title { get; set; }
    public string Body { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public string CountryFlag { get; set; } = string.Empty;
    public DateTime SubmittedAt { get; set; }
    public string Status { get; set; } = "pending";
}

// POST /api/reviews — public submission (WriteReviewModal.tsx).
public class ReviewSubmissionRequest
{
    public int Rating { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Title { get; set; }
    public string Body { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public string CountryFlag { get; set; } = string.Empty;
}
