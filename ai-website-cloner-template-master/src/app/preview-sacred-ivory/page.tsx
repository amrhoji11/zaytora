import { SacredIvoryHeritage } from "@/components/invitation-templates/sacred-ivory-heritage/SacredIvoryHeritage";

// Standalone review page for the "Sacred Ivory Heritage" template clone --
// not wired into the real Template/InvitationCanvas system yet. Delete this
// route (and the sibling component folder) once a decision is made on
// whether/how to fold it into the platform's own template mechanism.
export default function SacredIvoryHeritagePreviewPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-neutral-950 p-8">
      <SacredIvoryHeritage
        groomName="Mohammed"
        brideName="Leila"
        startDate="2027-03-23"
        endDate="2027-03-24"
        openingVideoSrc="/invitation-templates/sacred-ivory-heritage/opening-animation.mp4"
        backgroundVideoSrc="/invitation-templates/sacred-ivory-heritage/ambient-loop.mp4"
        backgroundPosterSrc="/invitation-templates/sacred-ivory-heritage/poster.jpg"
      />
      <p className="max-w-sm text-center text-xs text-neutral-500">
        معاينة مستقلة — sacred-ivory-heritage. Reload the page to replay the opening video.
      </p>
    </div>
  );
}
