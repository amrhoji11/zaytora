"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { DownloadIcon, RefreshIcon, XIcon, ZapIcon, ZapOffIcon } from "@/components/icons";
import { uploadCapturedPhoto } from "@/lib/services/invitations.service";

const CAMERA_SUPPORTED = typeof navigator !== "undefined" && Boolean(navigator.mediaDevices?.getUserMedia);

// Caps the captured photo's longest side before it's ever encoded -- keeps
// both the guest's own saved copy and the dashboard upload well under the
// backend's 8MB limit without a visible quality hit (a phone's raw camera
// resolution is far more than any screen needs to display this photo at).
const MAX_CAPTURE_DIMENSION = 1600;

const COPY = {
  ar: {
    close: "إغلاق",
    flash: "الفلاش",
    flip: "قلب الكاميرا",
    retake: "إعادة الالتقاط",
    save: "حفظ",
    saving: "جارٍ الحفظ...",
    notSupported: "الكاميرا غير مدعومة في هذا المتصفح",
    permissionError: "تعذّر الوصول إلى الكاميرا",
  },
  en: {
    close: "Close",
    flash: "Flash",
    flip: "Flip camera",
    retake: "Retake",
    save: "Save",
    saving: "Saving...",
    notSupported: "Camera not supported in this browser",
    permissionError: "Couldn't access the camera",
  },
};

// Draws the same names + date branding the live preview overlays onto the
// captured canvas, so the souvenir photo a guest downloads carries the
// invitation's own signature (matching numinds.me's reference capture flow)
// instead of a bare, unbranded snapshot.
function paintBrand(ctx: CanvasRenderingContext2D, width: number, height: number, names: string, eventDate: string | null) {
  const centerX = width / 2;
  const baseY = height * 0.82;

  ctx.save();
  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(0,0,0,0.35)";
  ctx.shadowColor = "rgba(0,0,0,0.6)";
  ctx.shadowBlur = width * 0.02;

  if (names) {
    ctx.font = `${Math.round(width * 0.07)}px "Great Vibes", cursive`;
    ctx.fillStyle = "#ffffff";
    ctx.fillText(names, centerX, baseY);
  }
  if (eventDate) {
    ctx.font = `${Math.round(width * 0.028)}px Georgia, serif`;
    ctx.fillStyle = "#f2f2f2";
    ctx.fillText(eventDate, centerX, baseY + width * 0.045);
  }
  ctx.restore();
}

export function CameraOverlay({
  isRtl,
  onClose,
  standalone = false,
  names = "",
  eventDate = null,
  invitationId = null,
  readOnly = false,
}: {
  isRtl: boolean;
  onClose: () => void;
  standalone?: boolean;
  // The couple's names / formatted event date, baked into the live
  // preview and the final capture as a branded frame — see
  // InvitationCanvas's own `names`/`eventDate` (same source, same font
  // as the hero) so the photo-booth shot reads as part of this specific
  // invitation, not a generic camera.
  names?: string;
  eventDate?: string | null;
  // The real invitation id, so a capture can also upload to the owner's
  // dashboard "Captured" tab (see uploadCapturedPhoto below). Null for the
  // template/demo previews (buildMockInvitation has no real backend id).
  invitationId?: string | null;
  // The studio's own "designer previewing their draft" surfaces (same flag
  // InvitationCanvas passes to InteractiveRSVPModal) — a capture here is the
  // designer testing the camera, not a real guest, so it shouldn't count
  // against the invitation's captured-photo storage.
  readOnly?: boolean;
}) {
  const t = isRtl ? COPY.ar : COPY.en;
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [permissionError, setPermissionError] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [flashOn, setFlashOn] = useState(false);
  const [flashSupported, setFlashSupported] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!CAMERA_SUPPORTED) return;
    let cancelled = false;

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode }, audio: false })
      .then((stream) => {
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
        const [track] = stream.getVideoTracks();
        // Torch control only exists on some Android Chrome back-camera
        // tracks — feature-detected rather than assumed, so the flash
        // button simply doesn't render where it can't actually do anything.
        const capabilities = track.getCapabilities?.();
        setFlashSupported(Boolean(capabilities && "torch" in capabilities));
      })
      .catch(() => setPermissionError(true));

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, [facingMode]);

  useEffect(() => {
    const [track] = streamRef.current?.getVideoTracks() ?? [];
    if (!track || !flashSupported) return;
    track.applyConstraints({ advanced: [{ torch: flashOn } as MediaTrackConstraintSet] }).catch(() => {});
  }, [flashOn, flashSupported]);

  const error = !CAMERA_SUPPORTED ? t.notSupported : permissionError ? t.permissionError : null;

  function capture() {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;
    const scale = Math.min(1, MAX_CAPTURE_DIMENSION / Math.max(video.videoWidth, video.videoHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(video.videoWidth * scale);
    canvas.height = Math.round(video.videoHeight * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // Mirror the front camera the same way the live <video> preview is
    // mirrored (see the "scale-x-[-1]" class below) — otherwise a selfie's
    // captured photo reads backwards (text flipped) compared to what the
    // guest just saw and framed themselves against.
    if (facingMode === "user") {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    if (facingMode === "user") {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
    paintBrand(ctx, canvas.width, canvas.height, names, eventDate);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    setPhoto(dataUrl);

    // Uploads to the owner's dashboard "Captured" tab, independent of
    // whatever the guest does with their own local copy below (handleSave).
    // Best-effort and silent: a failed upload shouldn't block or alarm the
    // guest over a bonus feature they didn't ask to use.
    if (invitationId && !readOnly) {
      canvas.toBlob(
        (blob) => {
          if (!blob) return;
          const file = new File([blob], "captured-photo.jpg", { type: "image/jpeg" });
          uploadCapturedPhoto(invitationId, file).catch((error) => {
            console.error("[camera] failed to upload captured photo:", error);
          });
        },
        "image/jpeg",
        0.85
      );
    }
  }

  async function handleSave() {
    if (!photo) return;
    setSaving(true);
    try {
      // iOS Safari, and in-app browsers built on it (Messenger's included),
      // never reliably honor <a download> — it just navigates to the raw
      // image instead of saving it. The Web Share API is what actually
      // triggers the native "Save Image" sheet on those same browsers.
      if (typeof navigator.share === "function" && typeof navigator.canShare === "function") {
        const blob = await (await fetch(photo)).blob();
        const file = new File([blob], "invitation-photo.jpg", { type: "image/jpeg" });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({ files: [file] });
          return;
        }
      }
    } catch (error) {
      // The guest dismissing the native share sheet also rejects this
      // promise (AbortError) — that's a deliberate choice, not a failure
      // that should fall through to the manual-save prompt below.
      if ((error as DOMException)?.name === "AbortError") return;
    } finally {
      setSaving(false);
    }
    // Web Share (or file-sharing specifically) isn't available here — the
    // one technique that works across every iOS browser and in-app webview
    // without exception is opening the image directly, so the guest can
    // long-press it and choose "Add to Photos" from the native menu.
    window.open(photo, "_blank");
  }

  return (
    <div
      className={cn(
        // Higher than BottomBar's z-[999] (standalone) — otherwise the
        // persistent nav bar paints on top of this overlay's own flip/
        // capture controls at that same bottom-of-screen position, so a
        // guest sees the live camera feed with no visible way to actually
        // take or flip the shot.
        "z-[1100] flex flex-col bg-black animate-in fade-in duration-300",
        standalone ? "fixed inset-0" : "absolute inset-0"
      )}
    >
      <div className="relative flex-1 overflow-hidden">
        {error ? (
          <div className="flex h-full items-center justify-center px-6 text-center text-xs text-white/70">{error}</div>
        ) : photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo} alt="" className="size-full object-cover" />
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className={cn("size-full object-cover", facingMode === "user" && "scale-x-[-1]")}
            />
            {(names || eventDate) && (
              <div className="pointer-events-none absolute inset-x-0 bottom-[18%] flex flex-col items-center gap-1 px-4 text-center [text-shadow:0_2px_10px_rgba(0,0,0,0.6)]">
                {names && <p className="font-great-vibes text-3xl text-white">{names}</p>}
                {eventDate && <p className="text-xs tracking-wide text-white/90">{eventDate}</p>}
              </div>
            )}
          </>
        )}

        <button
          type="button"
          onClick={onClose}
          aria-label={t.close}
          className="absolute end-3 top-3 flex size-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-colors hover:bg-black/60"
        >
          <XIcon className="size-4" />
        </button>
        {!error && !photo && flashSupported && (
          <button
            type="button"
            onClick={() => setFlashOn((value) => !value)}
            aria-label={t.flash}
            className="absolute start-3 top-3 flex size-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-colors hover:bg-black/60"
          >
            {flashOn ? <ZapIcon className="size-4" /> : <ZapOffIcon className="size-4" />}
          </button>
        )}
      </div>

      {!error && (
        <div className="flex items-center justify-center gap-6 py-4">
          {photo ? (
            <>
              <button
                type="button"
                onClick={() => setPhoto(null)}
                aria-label={t.retake}
                className="flex size-11 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md transition-colors hover:bg-white/25"
              >
                <RefreshIcon className="size-4" />
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                aria-label={saving ? t.saving : t.save}
                className="flex size-16 items-center justify-center rounded-full border-4 border-white/40 bg-white transition-opacity disabled:opacity-60"
              >
                <DownloadIcon className="size-6 text-gray-900" />
              </button>
              <span className="w-11" aria-hidden />
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setFacingMode((mode) => (mode === "user" ? "environment" : "user"))}
                aria-label={t.flip}
                className="flex size-11 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md transition-colors hover:bg-white/25"
              >
                <RefreshIcon className="size-4" />
              </button>
              <button
                type="button"
                onClick={capture}
                aria-label={isRtl ? "التقاط" : "Capture"}
                className="flex size-16 items-center justify-center rounded-full border-4 border-white/40 bg-white"
              >
                <span className="size-11 rounded-full bg-white ring-2 ring-inset ring-gray-300" />
              </button>
              <span className="w-11" aria-hidden />
            </>
          )}
        </div>
      )}
    </div>
  );
}
