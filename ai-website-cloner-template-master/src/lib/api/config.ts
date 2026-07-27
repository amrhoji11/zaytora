export const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/+$/, "");

if (!API_BASE_URL) {
  // Surfaces misconfiguration immediately instead of failing silently on every request.
  console.warn(
    "[api] NEXT_PUBLIC_API_BASE_URL is not set. Add it to .env.local, e.g.\n" +
      "  NEXT_PUBLIC_API_BASE_URL=https://localhost:5001/api"
  );
}
