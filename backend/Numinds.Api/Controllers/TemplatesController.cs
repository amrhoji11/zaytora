using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Numinds.Api.Data;
using Numinds.Api.Models.Dtos;

namespace Numinds.Api.Controllers;

[ApiController]
[Route("api/templates")]
public class TemplatesController(NumindsDbContext db) : ControllerBase
{
    // GET /api/templates?category=wedding
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TemplateDto>>> GetTemplates(
        [FromQuery] string? category,
        CancellationToken cancellationToken)
    {
        var query = db.Templates.AsNoTracking().AsQueryable();

        if (!string.IsNullOrWhiteSpace(category))
        {
            query = query.Where(t => t.Category == category);
        }

        var templates = await query
            .OrderByDescending(t => t.IsPopular)
            .ThenBy(t => t.Code)
            .Select(t => new TemplateDto
            {
                Id = t.Id.ToString(),
                Code = t.Code,
                Category = t.Category,
                ImageUrl = t.ImageUrl,
                IsPopular = t.IsPopular,
            })
            .ToListAsync(cancellationToken);

        // SQLite translates Guid.ToString() in the query above to its own hex()-style
        // function, which emits uppercase — inconsistent with the lowercase Guid.ToString()
        // .NET uses everywhere else (e.g. InvitationDto.TemplateId). Normalize here so
        // template ids compare equal to the ones invitations are actually saved with.
        foreach (var template in templates)
        {
            template.Id = template.Id.ToLowerInvariant();
        }

        return Ok(templates);
    }

    // GET /api/templates/{id}
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<TemplateDto>> GetTemplate(Guid id, CancellationToken cancellationToken)
    {
        var template = await db.Templates.AsNoTracking().FirstOrDefaultAsync(t => t.Id == id, cancellationToken);

        if (template is null)
        {
            return NotFound();
        }

        return Ok(new TemplateDto
        {
            Id = template.Id.ToString().ToLowerInvariant(),
            Code = template.Code,
            Category = template.Category,
            ImageUrl = template.ImageUrl,
            IsPopular = template.IsPopular,
        });
    }
}
