namespace Numinds.Api.Models.Entities;

// A guest's photo taken with the invitation's built-in camera
// (CameraOverlay.tsx) and uploaded here so the owner's dashboard "Captured"
// tab gets a copy too -- independent of whatever the guest does with their
// own local save (share sheet / long-press "Add to Photos").
public class CapturedPhoto
{
    public Guid Id { get; set; }
    public Guid InvitationId { get; set; }
    public Invitation? Invitation { get; set; }

    public string PhotoUrl { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}
