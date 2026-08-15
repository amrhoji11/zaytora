import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Real partners onboard without a logo file at first — a clean initials
// avatar stands in until one is uploaded, instead of a broken image or a
// stock placeholder graphic.
export function getInitials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean)
  const initials = words.slice(0, 2).map((word) => word[0]?.toUpperCase() ?? "")
  return initials.join("") || "?"
}

// Every remote host next/image is allowed to fetch from — must match
// next.config.ts's images.remotePatterns (the API host there is env-driven,
// so this only lists the fixed one: Unsplash).
const NEXT_IMAGE_SAFE_HOSTS = new Set(["images.unsplash.com"])

// next/image throws a hard, page-crashing render error for any src whose
// hostname isn't explicitly allowlisted in next.config.ts — fine for our
// own seeded template photos, but the admin "create template" flow
// (src/app/admin/video-templates, adminTemplatesStore.ts) lets an admin
// paste in *any* URL as a template's imageUrl (a Pinterest share link like
// https://pin.it/... has ended up saved there before — not even a raw image
// URL, just a redirect page). Falling back to a plain <img> for anything
// outside our own known hosts trades away next/image's optimization for
// that one src, but means one bad admin-entered record can never take down
// the entire public /templates page for every visitor.
export function canUseNextImage(url: string): boolean {
  if (url.startsWith("data:") || url.startsWith("/")) return true
  try {
    return NEXT_IMAGE_SAFE_HOSTS.has(new URL(url).hostname)
  } catch {
    return false
  }
}

// A template's BackgroundImageUrl/HeroIllustrationUrl can point at a short
// looping clip instead of a still photo (e.g. a lit-lantern archway with
// real ambient motion) — InvitationCanvas and ArchIslamicHeroFrame check
// this once to decide whether to mount <video autoPlay loop muted
// playsInline> instead of next/image, rather than requiring a separate
// per-template "isVideo" flag an admin could forget to set. Checked against
// the URL's path only (ignoring query strings, since Unsplash-style
// `?w=1200&q=80` params never appear on an actual video asset here) so a
// CDN's own cache-busting query param can't cause a false negative.
const VIDEO_EXTENSIONS = new Set(["mp4", "webm", "mov", "m4v"])

export function isVideoSource(url: string): boolean {
  const path = url.split("?")[0]?.split("#")[0] ?? ""
  const extension = path.split(".").pop()?.toLowerCase()
  return Boolean(extension && VIDEO_EXTENSIONS.has(extension))
}
