import { API_BASE_URL } from "./config";

/**
 * Thrown for any failed request. `status` is 0 for network/timeout failures
 * (i.e. the request never got an HTTP response), otherwise the HTTP status.
 * `details` carries the parsed response body when the API returned one —
 * typically an ASP.NET Core ProblemDetails object.
 */
export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  /** Aborts the request after this many ms. Defaults to 10s. */
  timeoutMs?: number;
}

const DEFAULT_TIMEOUT_MS = 10_000;

// ASP.NET Core Identity only ever returns 401 for a missing/invalid/expired
// auth cookie — a role check failure is 403, not 401 — so any 401 reliably
// means "not authenticated," never "authenticated but not allowed." That
// makes it safe for AuthContext to treat every 401 as a real "the session
// just ended" signal and clear `user`, instead of the UI carrying on as if
// still logged in while every subsequent action quietly 401s. A guest who
// was never logged in triggers this too (e.g. the anonymous GET /account/me
// check on every page) — harmless, since `user` is already null there.
type UnauthorizedListener = () => void;
let unauthorizedListener: UnauthorizedListener | null = null;

export function setUnauthorizedListener(listener: UnauthorizedListener | null) {
  unauthorizedListener = listener;
}

interface ProblemDetails {
  title?: string;
  detail?: string;
  message?: string;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, timeoutMs = DEFAULT_TIMEOUT_MS, headers, ...init } = options;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      // Sends the ASP.NET Core auth cookie cross-origin; the API must respond
      // with Access-Control-Allow-Credentials + an explicit allowed origin.
      credentials: "include",
      headers: {
        Accept: "application/json",
        ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiError(`Request to ${path} timed out after ${timeoutMs}ms`, 0);
    }
    throw new ApiError(
      error instanceof Error ? error.message : `Network error requesting ${path}`,
      0
    );
  } finally {
    clearTimeout(timeout);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const payload = isJson ? await response.json().catch(() => undefined) : undefined;

  if (!response.ok) {
    if (response.status === 401) {
      unauthorizedListener?.();
    }
    const problem = payload as ProblemDetails | undefined;
    const message = problem?.title ?? problem?.detail ?? problem?.message ?? response.statusText;
    throw new ApiError(message, response.status, payload);
  }

  return payload as T;
}

// Collapses concurrent identical GET calls into a single network request —
// several independent components (e.g. the homepage's QuoteCarousel and
// TestimonialsSection both calling listApprovedReviews()) otherwise each
// fire their own fetch for the exact same data on the same render pass.
// Entries are removed as soon as the request settles, so this only dedupes
// genuinely overlapping calls — it's not a cache and never serves stale data.
const inFlightGets = new Map<string, Promise<unknown>>();

function dedupedGet<T>(path: string, options?: RequestOptions): Promise<T> {
  if (options) return request<T>(path, { ...options, method: "GET" });

  const existing = inFlightGets.get(path);
  if (existing) return existing as Promise<T>;

  const promise = request<T>(path, { method: "GET" }).finally(() => {
    inFlightGets.delete(path);
  });
  inFlightGets.set(path, promise);
  return promise;
}

export const apiClient = {
  get: <T>(path: string, options?: RequestOptions) => dedupedGet<T>(path, options),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "POST", body }),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "PUT", body }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "PATCH", body }),
  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "DELETE" }),
};
