import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PricingHeroSection } from "@/components/sections/pricing/pricing-hero-section";
import { PricingTierSection } from "@/components/sections/pricing/pricing-tier-section";
import { PricingGuaranteeSection } from "@/components/sections/pricing/pricing-guarantee-section";
import { PricingFaqSection } from "@/components/sections/pricing/pricing-faq-section";
import { PricingCtaSection } from "@/components/sections/pricing/pricing-cta-section";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "One flat $59/year. Only pay if you save on property taxes. Full refund guarantee.",
  alternates: { canonical: "/pricing" },
};

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col scroll-smooth">
      <Header />
      <main className="flex-1">
        <PricingHeroSection />
        <PricingTierSection />
        <PricingGuaranteeSection />
        <PricingFaqSection />
        <PricingCtaSection />
      </main>
      <Footer />
    </div>
  );
}
