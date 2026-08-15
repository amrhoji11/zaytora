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
