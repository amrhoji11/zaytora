import type { MetadataRoute } from "next";

const BASE_URL = "https://www.zaytorainvites.com";

const PUBLIC_ROUTES = ["", "/OurPartners", "/Prices", "/contact-us", "/guide", "/templates", "/login", "/signup"];

export default function sitemap(): MetadataRoute.Sitemap {
  return PUBLIC_ROUTES.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
  }));
}
