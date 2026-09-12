namespace Numinds.Api.Models.Dtos;

// POST /api/meta/pageview body — sent as a fire-and-forget beacon by
// MetaPixel.tsx alongside its own client-side fbq('track', 'PageView', ...)
// call, carrying the exact same EventId so Meta can deduplicate the pair.
public class MetaPageViewRequest
{
    public string EventId { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    public string? Fbc { get; set; }
    public string? Fbp { get; set; }
}
