namespace Numinds.Api.Models.Entities;

public class Template
{
    public Guid Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public bool IsPopular { get; set; }

    public ICollection<Invitation> Invitations { get; set; } = new List<Invitation>();
}
