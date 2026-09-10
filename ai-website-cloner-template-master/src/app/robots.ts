import type { MetadataRoute } from "next";

const BASE_URL = "https://www.zaytorainvites.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Private/authenticated areas, plus per-couple invitation pages —
      // shareable by direct link, but not meant to be publicly searchable.
      disallow: ["/admin", "/dashboard", "/account", "/studio", "/invitationpublic", "/reset-password"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
