import type { NextConfig } from "next";

function apiImageRemotePattern() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiBaseUrl) return [];

  try {
    const { protocol, hostname, port } = new URL(apiBaseUrl);
    return [
      {
        protocol: protocol.replace(":", "") as "http" | "https",
        hostname,
        port,
        pathname: "/**",
      },
    ];
  } catch {
    return [];
  }
}

const nextConfig: NextConfig = {
  images: {
    // Lets next/image render template thumbnails served by the ASP.NET Core API.
    remotePatterns: apiImageRemotePattern(),
  },
};

export default nextConfig;
