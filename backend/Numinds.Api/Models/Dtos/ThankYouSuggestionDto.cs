namespace Numinds.Api.Models.Dtos;

public class ThankYouSuggestionDto
{
    public string Id { get; set; } = string.Empty;
    public string Label { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public int SortOrder { get; set; }
}

public class ThankYouSuggestionWriteRequest
{
    public string Label { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
    public int SortOrder { get; set; }
}

public class SetThankYouSuggestionActiveRequest
{
    public bool IsActive { get; set; }
}

public class ThankYouSuggestionImageUploadResponse
{
    public string Url { get; set; } = string.Empty;
}
