using System.Text.Json;

namespace Numinds.Api.Models.Dtos;

// Shared (de)serialization for Envelope.FoldPointsJson, used by both
// EnvelopesController (reading/writing an Envelope directly) and
// TemplatesController (reading through a Template's assigned Envelope) —
// kept in one place so the two never drift.
public static class EnvelopeFoldPointsJson
{
    // Comfortably more fold lines than any real envelope photo would need —
    // just a sanity cap against a malformed/abusive request body.
    private const int MaxPoints = 12;

    public static List<EnvelopeFoldPoint> Parse(string? json)
    {
        if (string.IsNullOrWhiteSpace(json))
        {
            return [];
        }
        try
        {
            return JsonSerializer.Deserialize<List<EnvelopeFoldPoint>>(json) ?? [];
        }
        catch (JsonException)
        {
            return [];
        }
    }

    // Clamped to the photo's own bounds and capped in count — the frontend
    // draws these against the actual photo already, so out-of-range values
    // here would only ever come from a malformed/direct API call.
    public static string? Serialize(List<EnvelopeFoldPoint>? points)
    {
        if (points is null || points.Count == 0)
        {
            return null;
        }
        var clamped = points
            .Take(MaxPoints)
            .Select(p => new EnvelopeFoldPoint { X = Math.Clamp(p.X, 0, 100), Y = Math.Clamp(p.Y, 0, 100) })
            .ToList();
        return JsonSerializer.Serialize(clamped);
    }
}
