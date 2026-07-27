using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Numinds.Api.Data;
using Numinds.Api.Models.Dtos;
using Numinds.Api.Models.Entities;

namespace Numinds.Api.Controllers;

[ApiController]
[Route("api/invitations")]
public class InvitationsController(
    NumindsDbContext db,
    UserManager<ApplicationUser> userManager) : ControllerBase
{
    // POST /api/invitations
    // Anonymous is allowed: the Hero "إنشاء دعوة" CTA can create a draft
    // before the user has an account. If a session cookie is present the
    // draft is associated with that user instead.
    [HttpPost]
    public async Task<ActionResult<InvitationDto>> Create(
        CreateInvitationRequest request,
        CancellationToken cancellationToken)
    {
        Guid? templateId = null;
        if (!string.IsNullOrWhiteSpace(request.TemplateId))
        {
            if (!Guid.TryParse(request.TemplateId, out var parsedTemplateId))
            {
                return BadRequest(new { title = "templateId must be a valid GUID." });
            }

            var templateExists = await db.Templates.AnyAsync(t => t.Id == parsedTemplateId, cancellationToken);
            if (!templateExists)
            {
                return BadRequest(new { title = $"Unknown templateId '{request.TemplateId}'." });
            }

            templateId = parsedTemplateId;
        }

        Guid? userId = null;
        if (User.Identity?.IsAuthenticated == true)
        {
            var user = await userManager.GetUserAsync(User);
            userId = user?.Id;
        }

        var invitation = new Invitation
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            TemplateId = templateId,
            Status = "draft",
            CreatedAt = DateTime.UtcNow,
        };

        db.Invitations.Add(invitation);
        await db.SaveChangesAsync(cancellationToken);

        var dto = ToDto(invitation);
        return CreatedAtAction(nameof(GetById), new { id = invitation.Id }, dto);
    }

    // GET /api/invitations/{id}
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<InvitationDto>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var invitation = await db.Invitations.AsNoTracking().FirstOrDefaultAsync(i => i.Id == id, cancellationToken);
        if (invitation is null)
        {
            return NotFound();
        }

        return Ok(ToDto(invitation));
    }

    private static InvitationDto ToDto(Invitation invitation) => new()
    {
        Id = invitation.Id.ToString(),
        Status = invitation.Status,
        EditUrl = $"/studio?invitationId={invitation.Id}",
    };
}
