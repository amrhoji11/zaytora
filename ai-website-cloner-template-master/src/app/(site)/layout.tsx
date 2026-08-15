import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";

// Wraps every marketing/product page (home, templates, studio, dashboard,
// login, signup, guide) with the shared site chrome. /invitationpublic
// deliberately lives outside this group — it's a standalone guest-facing
// page with no header/footer, matching the reference invitation site.
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-1 pt-20 pb-16 md:pb-0">{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
