import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/sections/hero-section";
import { AssessmentGapSection } from "@/components/sections/assessment-gap-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";


export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <AssessmentGapSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </div>
  );
}
