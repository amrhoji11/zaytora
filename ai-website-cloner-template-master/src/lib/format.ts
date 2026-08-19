// Single source of truth for USD formatting across the admin dashboard —
// every page must use this so revenue totals stay cent-for-cent identical
// wherever the same underlying number is shown (Overview KPI cards, Orders
// table, Partners table, etc).
export function formatUsd(value: number): string {
  return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// Whole-dollar variant for space-constrained chart labels/tooltips only —
// never for a revenue total or a per-row price, which must always show
// exact cents via formatUsd above.
export function formatUsdCompact(value: number): string {
  return `$${value.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

// An invitation's `eventDateTime` is a bare wall-clock reading with no real
// timezone -- the studio's <input type="datetime-local"> sends e.g.
// "2026-08-19T17:50" as-is, and InvitationsController.Update stores it
// with DateTimeKind.Utc *only* because Npgsql's timestamptz column
// requires some Kind, not because it's meant as real UTC (the guest's
// actual offset lives separately in `timezone`). That Kind tag makes
// System.Text.Json serialize it back with a trailing "Z", which `new
// Date(iso)` then (correctly, per the ECMAScript spec) parses as real UTC
// -- so every Intl.DateTimeFormat/getDate()/getHours() call downstream
// silently converts it into the *viewer's own* browser timezone instead
// of displaying the digits exactly as entered. Stripping the trailing
// "Z"/offset before parsing keeps the reading as plain wall-clock time,
// so "5:50 PM" set in the studio always reads "5:50 PM" for every guest,
// regardless of where they are.
export function parseWallClockDate(iso: string): Date {
  return new Date(iso.replace(/(Z|[+-]\d{2}:?\d{2})$/, ""));
}
