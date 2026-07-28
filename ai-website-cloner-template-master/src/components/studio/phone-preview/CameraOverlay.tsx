"use client";

import { useEffect, useRef, useState } from "react";
import { CameraIcon, XIcon } from "@/components/icons";

const CAMERA_SUPPORTED = typeof navigator !== "undefined" && Boolean(navigator.mediaDevices?.getUserMedia);

export function CameraOverlay({ isRtl, onClose }: { isRtl: boolean; onClose: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [permissionError, setPermissionError] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);

  useEffect(() => {
    if (!CAMERA_SUPPORTED) return;
    let cancelled = false;

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "user" }, audio: false })
      .then((stream) => {
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch(() => setPermissionError(true));

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const error = !CAMERA_SUPPORTED
    ? isRtl
      ? "الكاميرا غير مدعومة في هذا المتصفح"
      : "Camera not supported in this browser"
    : permissionError
      ? isRtl
        ? "تعذّر الوصول إلى الكاميرا"
        : "Couldn't access the camera"
      : null;

  function capture() {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    setPhoto(canvas.toDataURL("image/png"));
  }

  return (
    <div className="absolute inset-0 z-[60] flex flex-col bg-black">
      <div className="flex items-center justify-between px-3 py-2">
        <span className="text-xs font-medium text-white">{isRtl ? "الكاميرا" : "Camera"}</span>
        <button
          type="button"
          onClick={onClose}
          aria-label={isRtl ? "إغلاق" : "Close"}
          className="flex size-7 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
        >
          <XIcon className="size-4" />
        </button>
      </div>

      <div className="relative flex-1 overflow-hidden">
        {error ? (
          <div className="flex h-full items-center justify-center px-6 text-center text-xs text-white/70">{error}</div>
        ) : photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo} alt="" className="size-full object-cover" />
        ) : (
          <video ref={videoRef} autoPlay muted playsInline className="size-full object-cover" />
        )}
      </div>

      {!error && (
        <div className="flex items-center justify-center py-4">
          {photo ? (
            <button
              type="button"
              onClick={() => setPhoto(null)}
              className="rounded-full bg-white px-5 py-2 text-xs font-medium text-gray-900"
            >
              {isRtl ? "إعادة الالتقاط" : "Retake"}
            </button>
          ) : (
            <button
              type="button"
              onClick={capture}
              aria-label={isRtl ? "التقاط" : "Capture"}
              className="flex size-14 items-center justify-center rounded-full border-4 border-white/40 bg-white"
            >
              <CameraIcon className="size-6 text-gray-900" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
