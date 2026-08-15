namespace Numinds.Api.Models.Dtos;

// A single fold-line's outer endpoint, as a percentage of the envelope
// photo's own width/height — the other end of that fold is always the
// envelope's own seal position, so only this one point needs storing per
// line. See Envelope.FoldPointsJson and FoldLineDrawer.tsx.
public class EnvelopeFoldPoint
{
    public double X { get; set; }
    public double Y { get; set; }
}

public class EnvelopeDto
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string PhotoUrl { get; set; } = string.Empty;
    public double SealXPercent { get; set; }
    public double SealYPercent { get; set; }
    // "flap" (a flat envelope, opened by peeling its folds back) or "scroll"
    // (a rolled, string-tied letter, opened by unrolling it) — see
    // PhotoWaxSealEnvelopeCover.tsx / ScrollUnrollEnvelopeCover.tsx.
    public string OpeningStyle { get; set; } = "flap";
    // Only meaningful when OpeningStyle is "flap" — the fold lines the admin
    // traced on their own photo (FoldLineDrawer.tsx), each just the point
    // where that fold reaches the photo's edge. Empty falls back to the
    // original four-symmetric-flaps model. See Envelope.FoldPointsJson.
    public List<EnvelopeFoldPoint> FoldPoints { get; set; } = [];
    public bool IsActive { get; set; }
    // How many templates currently point at this envelope — lets
    // /admin/envelopes warn before deleting one that's still in use, same
    // idea as TemplateDto.UsageCount.
    public int TemplateCount { get; set; }
}

public class EnvelopeWriteRequest
{
    public string Name { get; set; } = string.Empty;
    public string PhotoUrl { get; set; } = string.Empty;
    public double SealXPercent { get; set; }
    public double SealYPercent { get; set; }
    public string OpeningStyle { get; set; } = "flap";
    public List<EnvelopeFoldPoint> FoldPoints { get; set; } = [];
    public bool IsActive { get; set; } = true;
}

// POST /api/envelopes/image response.
public class EnvelopeImageUploadResponse
{
    public string Url { get; set; } = string.Empty;
}
