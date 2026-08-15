namespace Numinds.Api.Models.Dtos;

// Generic paged-list envelope for admin list endpoints (Orders/Partners/
// Reviews/Users) — Page is 1-based, TotalCount is the full match count
// (before Skip/Take) so the frontend can compute total pages.
public class PagedResult<T>
{
    public List<T> Items { get; set; } = [];
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
}
