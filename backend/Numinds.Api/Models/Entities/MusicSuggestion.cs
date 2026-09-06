namespace Numinds.Api.Models.Entities;

// Admin-curated music tracks a customer can pick from — same role as
// ThankYouSuggestion, but for Step13Music's library instead of Step04's
// thank-you cards. Populated either directly (the admin music-suggestions
// management flow) or as a side effect of TemplateEditModal's "also save as
// a customer suggestion" checkbox when assigning a template's default track.
// Url is either a hosted audio file (uploaded, see MusicSuggestionsController.
// UploadAudio) or a YouTube link — same dual-mode convention as
// Invitation.MusicUrl / Template.DefaultMusicUrl, told apart at playback time
// by useMusicPlayer's own isVideoSource-equivalent check, not a stored flag.
public class MusicSuggestion
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Artist { get; set; }
    public string Url { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
    public int SortOrder { get; set; }
    public DateTime CreatedAt { get; set; }
}
