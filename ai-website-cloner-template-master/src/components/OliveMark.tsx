// Small decorative olive-branch mark (leaf + two drupes) used next to the
// "ZAYTORA" wordmark wherever it appears as a logo (Header, Footer, auth
// cards, admin sidebar) — purely ornamental, so it's aria-hidden and never
// carries text content of its own.
export function OliveMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M6 34 C 14 28, 20 20, 26 10" stroke="#4C7A1E" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M26 10 C 34 4, 44 4, 46 2 C 44 10, 36 16, 26 18 C 24 15, 24 12, 26 10 Z"
        fill="#6FA22E"
      />
      <ellipse cx="9" cy="30" rx="5.5" ry="6.5" fill="#3B1F2B" />
      <ellipse cx="7.3" cy="27.3" rx="1.6" ry="1.2" fill="#6FA22E" opacity="0.55" />
      <ellipse cx="17.5" cy="24" rx="5" ry="6" fill="#2E1B14" />
      <ellipse cx="16" cy="21.6" rx="1.4" ry="1.1" fill="#6FA22E" opacity="0.5" />
    </svg>
  );
}
