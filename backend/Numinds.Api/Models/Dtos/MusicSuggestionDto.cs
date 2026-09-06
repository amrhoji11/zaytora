namespace Numinds.Api.Models.Dtos;

public class MusicSuggestionDto
{
    public string Id { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string? Artist { get; set; }
    public string Url { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public int SortOrder { get; set; }
}

public class MusicSuggestionWriteRequest
{
    public string Title { get; set; } = string.Empty;
    public string? Artist { get; set; }
    public string Url { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
    public int SortOrder { get; set; }
}

public class SetMusicSuggestionActiveRequest
{
    public bool IsActive { get; set; }
}

// POST /api/music-suggestions/audio response.
public class MusicSuggestionAudioUploadResponse
{
    public string Url { get; set; } = string.Empty;
}
