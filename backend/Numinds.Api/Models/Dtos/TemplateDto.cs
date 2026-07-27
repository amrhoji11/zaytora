namespace Numinds.Api.Models.Dtos;

// Mirrors src/types/api.ts -> TemplateDto (System.Text.Json defaults to camelCase).
public class TemplateDto
{
    public string Id { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public bool IsPopular { get; set; }
}
