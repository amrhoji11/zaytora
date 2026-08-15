namespace Numinds.Api.Models.Entities;

// A customer testimonial, public-submitted then admin-moderated — same
// pending/approved/rejected lifecycle as Partner.
public class Review
{
    public Guid Id { get; set; }

    public int Rating { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Title { get; set; }
    public string Body { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public string CountryFlag { get; set; } = string.Empty;

    public string Status { get; set; } = "pending"; // pending | approved | rejected
    public DateTime SubmittedAt { get; set; }
}
