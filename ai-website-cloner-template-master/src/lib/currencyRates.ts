// Live SAR-based exchange rates for the payment step, with a 24h
// localStorage cache and a static fallback so the checkout total never goes
// blank (offline, API rate-limited, CORS hiccup, etc.).
export type CurrencyCode = "SAR" | "USD" | "ILS" | "GBP" | "EUR";

export type CurrencyRates = Record<CurrencyCode, number>;

export const DEFAULT_RATES: CurrencyRates = {
  SAR: 1,
  USD: 0.267,
  ILS: 0.98,
  GBP: 0.21,
  EUR: 0.245,
};

const CACHE_KEY = "numinds:currency-rates:v1";
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

interface CachedPayload {
  fetchedAt: number;
  rates: CurrencyRates;
}

function readCache(): CurrencyRates | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CachedPayload;
    if (!parsed.fetchedAt || Date.now() - parsed.fetchedAt > CACHE_TTL_MS) return null;
    return parsed.rates;
  } catch {
    return null;
  }
}

function writeCache(rates: CurrencyRates) {
  if (typeof window === "undefined") return;
  try {
    const payload: CachedPayload = { fetchedAt: Date.now(), rates };
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
  } catch {
    // Storage full or unavailable (private browsing, etc.) — non-fatal, the
    // rates just won't be cached for next time.
  }
}

interface ExchangeRateApiResponse {
  result: string;
  base_code: string;
  rates: Record<string, number>;
}

async function fetchLiveRates(): Promise<CurrencyRates> {
  const response = await fetch("https://open.er-api.com/v6/latest/SAR");
  if (!response.ok) throw new Error(`Exchange rate API responded ${response.status}`);

  const data = (await response.json()) as ExchangeRateApiResponse;
  if (data.result !== "success" || !data.rates) {
    throw new Error("Exchange rate API returned an unexpected payload");
  }

  const rates: CurrencyRates = { ...DEFAULT_RATES };
  for (const code of Object.keys(DEFAULT_RATES) as CurrencyCode[]) {
    const value = data.rates[code];
    if (typeof value === "number" && Number.isFinite(value)) {
      rates[code] = value;
    }
  }
  rates.SAR = 1;
  return rates;
}

// Cache-first, then live fetch, then static defaults — in that order.
export async function loadCurrencyRates(): Promise<CurrencyRates> {
  const cached = readCache();
  if (cached) return cached;

  try {
    const rates = await fetchLiveRates();
    writeCache(rates);
    return rates;
  } catch (error) {
    console.error("[currency] failed to fetch live exchange rates, using defaults:", error);
    return DEFAULT_RATES;
  }
}
