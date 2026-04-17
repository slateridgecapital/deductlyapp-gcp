import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PricingCtaSection() {
  return (
    <section className="bg-slate-50 px-4 py-16 md:py-24">
      <div className="container mx-auto max-w-3xl text-center">
        <h2 className="mb-4 text-3xl font-bold text-slate-900 md:text-4xl">
          Stop overpaying on property taxes.
        </h2>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-slate-600">
          Get your savings estimate in 30 seconds.
        </p>
        <Button
          asChild
          className="h-12 bg-slate-900 px-8 text-base font-medium hover:bg-slate-800"
        >
          <Link href="/estimate">
            Estimate your savings
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
