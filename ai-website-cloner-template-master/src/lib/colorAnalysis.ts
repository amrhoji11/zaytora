"use client";

// Real, on-device image analysis for the admin "Create with AI" flow: this
// downscales the reference photo onto a canvas and averages its pixels into
// a dominant accent color, then derives the rest of the palette tokens
// InvitationCanvas's resolveCanvasTheme() actually reads (pageBg/cardBg/
// textColor/primaryAccent — see Template.cs) from that one color. There's no
// server-side vision/AI model behind this — it's a deterministic color
// extraction, which is also why it's safe from an IP standpoint: nothing
// about the source image's actual subject or composition is copied, only
// its color signature.

function clamp8(n: number) {
  return Math.min(255, Math.max(0, Math.round(n)));
}

function rgbToHex(r: number, g: number, b: number) {
  return `#${[r, g, b].map((c) => clamp8(c).toString(16).padStart(2, "0")).join("")}`;
}

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  const value = parseInt(full, 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

function lighten(hex: string, amount: number) {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHex(r + (255 - r) * amount, g + (255 - g) * amount, b + (255 - b) * amount);
}

function darken(hex: string, amount: number) {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHex(r * (1 - amount), g * (1 - amount), b * (1 - amount));
}

// Relative luminance (simplified) — decides whether this template should
// read as a light theme (dark text on a pale card, like most seeded
// templates) or a dark theme (pale text on a deep card, like Q002/G001).
function isLight(hex: string) {
  const [r, g, b] = hexToRgb(hex);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.55;
}

export interface ExtractedTheme {
  pageBg: string;
  cardBg: string;
  textColor: string;
  primaryAccent: string;
}

function themeFromAccent(accentColor: string): ExtractedTheme {
  if (isLight(accentColor)) {
    return {
      pageBg: `${lighten(accentColor, 0.88)},${lighten(accentColor, 0.95)}`,
      cardBg: lighten(accentColor, 0.82),
      textColor: darken(accentColor, 0.55),
      primaryAccent: darken(accentColor, 0.1),
    };
  }
  return {
    pageBg: `${darken(accentColor, 0.75)},${darken(accentColor, 0.65)}`,
    cardBg: darken(accentColor, 0.7),
    textColor: lighten(accentColor, 0.75),
    primaryAccent: lighten(accentColor, 0.15),
  };
}

const MAX_DIMENSION = 480;

// Downscales the file onto a canvas and averages a pixel sample into one
// accent color; also returns a compressed data-URL of the photo itself
// (this app has no image-hosting service, so the admin form persists it
// directly as the template's imageUrl/backgroundImageUrl).
export async function analyzeImageFile(file: File): Promise<{ theme: ExtractedTheme; dataUrl: string }> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");
  ctx.drawImage(bitmap, 0, 0, width, height);

  const { data } = ctx.getImageData(0, 0, width, height);
  let r = 0;
  let g = 0;
  let b = 0;
  let count = 0;
  // Every 7th pixel is plenty for a stable average and keeps this fast even
  // on a large photo scaled down to MAX_DIMENSION.
  for (let i = 0; i < data.length; i += 4 * 7) {
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
    count++;
  }

  const accentColor = rgbToHex(r / count, g / count, b / count);
  const dataUrl = canvas.toDataURL("image/jpeg", 0.82);
  return { theme: themeFromAccent(accentColor), dataUrl };
}

// Used when the admin supplies a reference URL instead of a file — a
// cross-origin image can't be sampled on a canvas without CORS headers we
// can't guarantee, so the theme is derived from the chosen category's own
// brand color instead.
export function themeFromCategoryColor(categoryColor: string): ExtractedTheme {
  return themeFromAccent(categoryColor);
}
