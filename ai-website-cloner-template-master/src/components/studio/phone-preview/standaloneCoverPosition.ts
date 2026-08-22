// Shared "cover the whole screen" positioning for envelope covers and
// ambient background layers when rendered on the guest-facing standalone
// page (InvitationCanvas variant="standalone"). Plain `fixed inset-0` pins
// an element to the full browser viewport, which only matches the
// invitation's actual content width on a real phone (viewport ~= content
// width) -- on a wider desktop browser it stretches full-screen layers edge
// to edge while the invitation content itself stays inside
// PublicInvitationView's `max-w-[393px]` column, visibly wider than
// everything else on the page. Capping the width here to that same 393px
// and centering keeps every full-screen layer aligned with that column on
// any viewport, with zero visual change on an actual phone (where `w-full`
// already resolves to less than 393px, so the max-width never engages).
export const STANDALONE_FULLSCREEN_CLASS = "fixed inset-y-0 left-1/2 w-full max-w-[393px] -translate-x-1/2";
