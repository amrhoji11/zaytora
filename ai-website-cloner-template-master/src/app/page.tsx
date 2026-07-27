import { Hero } from "@/components/Hero";
import { CategoryPills } from "@/components/CategoryPills";
import { QuoteCarousel } from "@/components/QuoteCarousel";
import { TemplatesGrid } from "@/components/TemplatesGrid";
import { FeaturesSection } from "@/components/FeaturesSection";
import { PricingSection } from "@/components/PricingSection";
import { PartnersSection } from "@/components/PartnersSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { FaqSection } from "@/components/FaqSection";
import { FinalCtaSection } from "@/components/FinalCtaSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Hero />

      <section id="templates" className="py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <CategoryPills />
          <div className="mb-12">
            <QuoteCarousel />
          </div>
          <TemplatesGrid />
        </div>
      </section>

      <FeaturesSection />
      <PricingSection />
      <PartnersSection />
      <TestimonialsSection />
      <FaqSection />
      <FinalCtaSection />
    </div>
  );
}
