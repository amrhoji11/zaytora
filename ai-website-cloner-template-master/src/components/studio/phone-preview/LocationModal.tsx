"use client";

import { MapPinIcon } from "@/components/icons";
import type { VenueItem } from "@/types/studio";

function resolveMapsHref(venue: VenueItem) {
  if (venue.mapUrl) return venue.mapUrl;
  const query = [venue.name, venue.address].filter(Boolean).join(", ");
  return query ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}` : null;
}

function resolveEmbedSrc(venue: VenueItem) {
  const query = [venue.name, venue.address].filter(Boolean).join(", ");
  return query ? `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed` : null;
}

export function LocationModal({ venues, openMapsLabel }: { venues: VenueItem[]; openMapsLabel: string }) {
  return (
    <div className="space-y-3">
      {venues.map((venue, index) => {
        const mapsHref = resolveMapsHref(venue);
        const embedSrc = resolveEmbedSrc(venue);
        return (
          <div key={index} className="space-y-2 rounded-xl bg-gray-50 p-2.5">
            <p className="text-xs font-medium text-gray-800">{venue.name || "—"}</p>
            {venue.address && <p className="text-[11px] text-gray-500">{venue.address}</p>}
            {embedSrc && (
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <iframe
                  src={embedSrc}
                  className="h-32 w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={venue.name || "map"}
                />
              </div>
            )}
            {mapsHref && (
              <a
                href={mapsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 rounded-lg border border-gold/40 py-1.5 text-[11px] font-medium text-gold transition-colors hover:bg-gold/5"
              >
                <MapPinIcon className="size-3" />
                {openMapsLabel}
              </a>
            )}
          </div>
        );
      })}
    </div>
  );
}
