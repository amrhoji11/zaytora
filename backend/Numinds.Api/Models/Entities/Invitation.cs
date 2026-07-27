namespace Numinds.Api.Models.Entities;

public class Invitation
{
    public Guid Id { get; set; }
    public Guid? UserId { get; set; }
    public ApplicationUser? User { get; set; }
    public Guid? TemplateId { get; set; }
    public Template? Template { get; set; }
    public string Status { get; set; } = "draft";
    public DateTime CreatedAt { get; set; }
}
