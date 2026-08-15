using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Numinds.Api.Data;
using Numinds.Api.Models;
using Numinds.Api.Models.Dtos;
using Numinds.Api.Models.Entities;

namespace Numinds.Api.Controllers;

[ApiController]
[Route("api/reviews")]
public class ReviewsController(NumindsDbContext db) : ControllerBase
{
    // POST /api/reviews — anonymous, public "Write a Review" form. Always
    // lands as "pending" for an admin to moderate on /admin/reviews.
    [HttpPost]
    public async Task<ActionResult<ReviewDto>> Submit(ReviewSubmissionRequest request, CancellationToken cancellationToken)
    {
        var review = new Review
        {
            Id = Guid.NewGuid(),
            Rating = request.Rating,
            Name = request.Name,
            Title = string.IsNullOrWhiteSpace(request.Title) ? null : request.Title,
            Body = request.Body,
            Country = request.Country,
            CountryFlag = request.CountryFlag,
            Status = "pending",
            SubmittedAt = DateTime.UtcNow,
        };

        db.Reviews.Add(review);
        await db.SaveChangesAsync(cancellationToken);

        return CreatedAtAction(nameof(GetApproved), null, ToDto(review));
    }

    // GET /api/reviews/approved — public, homepage testimonials.
    [HttpGet("approved")]
    public async Task<ActionResult<List<ReviewDto>>> GetApproved(CancellationToken cancellationToken)
    {
        var reviews = await db.Reviews
            .AsNoTracking()
            .Where(r => r.Status == "approved")
            .OrderByDescending(r => r.SubmittedAt)
            .ToListAsync(cancellationToken);

        return Ok(reviews.Select(ToDto).ToList());
    }

    // GET /api/reviews — admin, for /admin/reviews. `status` matches the
    // page's status tabs (omit/"all" for every status). `search` matches
    // Name/Title/Body/Country (indexed — see NumindsDbContext); paginated
    // since reviews accumulate indefinitely.
    [HttpGet]
    [Authorize(Roles = Roles.Admin)]
    public async Task<ActionResult<PagedResult<ReviewDto>>> List(
        [FromQuery] string? status,
        [FromQuery] string? search,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken cancellationToken = default)
    {
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 500);

        var query = db.Reviews.AsNoTracking().AsQueryable();
        if (!string.IsNullOrWhiteSpace(status) && status != "all")
        {
            query = query.Where(r => r.Status == status);
        }

        var term = search?.Trim();
        if (!string.IsNullOrEmpty(term))
        {
            query = query.Where(r =>
                r.Name.Contains(term) ||
                (r.Title != null && r.Title.Contains(term)) ||
                r.Body.Contains(term) ||
                r.Country.Contains(term));
        }

        var totalCount = await query.CountAsync(cancellationToken);
        var reviews = await query
            .OrderByDescending(r => r.SubmittedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return Ok(new PagedResult<ReviewDto>
        {
            Items = reviews.Select(ToDto).ToList(),
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize,
        });
    }

    [HttpPatch("{id:guid}/approve")]
    [Authorize(Roles = Roles.Admin)]
    public async Task<ActionResult<ReviewDto>> Approve(Guid id, CancellationToken cancellationToken)
    {
        var review = await db.Reviews.FirstOrDefaultAsync(r => r.Id == id, cancellationToken);
        if (review is null)
        {
            return NotFound();
        }

        review.Status = "approved";
        await db.SaveChangesAsync(cancellationToken);
        return Ok(ToDto(review));
    }

    [HttpPatch("{id:guid}/reject")]
    [Authorize(Roles = Roles.Admin)]
    public async Task<ActionResult<ReviewDto>> Reject(Guid id, CancellationToken cancellationToken)
    {
        var review = await db.Reviews.FirstOrDefaultAsync(r => r.Id == id, cancellationToken);
        if (review is null)
        {
            return NotFound();
        }

        review.Status = "rejected";
        await db.SaveChangesAsync(cancellationToken);
        return Ok(ToDto(review));
    }

    // DELETE /api/reviews/{id} — the admin UI's "Hide/Delete" action.
    [HttpDelete("{id:guid}")]
    [Authorize(Roles = Roles.Admin)]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var review = await db.Reviews.FirstOrDefaultAsync(r => r.Id == id, cancellationToken);
        if (review is null)
        {
            return NotFound();
        }

        db.Reviews.Remove(review);
        await db.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    private static ReviewDto ToDto(Review r) => new()
    {
        Id = r.Id.ToString(),
        Rating = r.Rating,
        Name = r.Name,
        Title = r.Title,
        Body = r.Body,
        Country = r.Country,
        CountryFlag = r.CountryFlag,
        SubmittedAt = r.SubmittedAt,
        Status = r.Status,
    };
}
