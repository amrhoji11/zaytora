namespace Numinds.Api.Models.Entities;

// A reusable envelope-cover photo an admin uploads once (see
// PhotoWaxSealEnvelopeCover.tsx on the frontend) and can then assign to any
// number of Templates, instead of re-uploading the same photo and
// re-clicking the seal position separately for every template that should
// use it. Deliberately its own entity/table rather than three columns on
// Template (an earlier draft did that) — this is what actually lets it be
// shared.
public class Envelope
{
    public Guid Id { get; set; }

    // Admin-facing label only ("ظرف كحلي بختم ذهبي") — never shown to a guest.
    public string Name { get; set; } = string.Empty;

    public string PhotoUrl { get; set; } = string.Empty;

    // Where the seal is actually printed in PhotoUrl, as a percentage of the
    // photo's own width/height — PhotoWaxSealEnvelopeCoverBase clips the
    // photo into four flaps that peel back from exactly this point, so it
    // has to land on the real seal, not a guessed center.
    public double SealXPercent { get; set; }
    public double SealYPercent { get; set; }

    // Which physical object this photo actually is, since a flat diamond-
    // flap envelope and a rolled/tied scroll open with completely different
    // motions on the frontend (see PhotoWaxSealEnvelopeCover.tsx's 4-flap
    // peel vs ScrollUnrollEnvelopeCover.tsx's 2-panel unroll) — "flap" is the
    // default so every envelope created before this field existed keeps its
    // current behavior.
    public string OpeningStyle { get; set; } = "flap";

    // Only meaningful when OpeningStyle is "flap" — the real fold lines the
    // admin traced on their own photo (see FoldLineDrawer.tsx), each stored
    // as the single point where that fold reaches the photo's edge (the
    // other end is always the seal above, so it doesn't need storing).
    // Photos vary: a real envelope can have one flap, two, four, or an
    // uneven mix, hinged at whatever edges the admin's own photo actually
    // shows — this isn't a fixed enum of shapes, PhotoWaxSealEnvelopeCover
    // builds however many flaps these points describe. Serialized as JSON
    // ("[{\"x\":12.5,\"y\":0},...]") rather than a child table — it's never
    // queried on its own, only ever read/written whole alongside its parent
    // Envelope. Null/empty falls back to the original four-symmetric-flaps
    // model (still correct for an envelope where all four really do meet at
    // a shared center point, and lets an admin skip drawing entirely).
    public string? FoldPointsJson { get; set; }

    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; }

    public ICollection<Template> Templates { get; set; } = new List<Template>();
}
