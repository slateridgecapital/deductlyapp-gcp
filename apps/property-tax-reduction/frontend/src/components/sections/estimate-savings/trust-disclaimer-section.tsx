"use client";

import { Separator } from "@/components/ui/separator";

export function TrustDisclaimerSection() {
  return (
    <section className="pt-4">
      <Separator className="mb-6 bg-slate-200" />
      <div className="space-y-3 text-sm text-slate-500">
        <p>
          Uses publicly available county assessment data and recent market
          indicators.
        </p>
        <p>This is an estimate. Eligibility and outcomes vary by county.</p>
        <p>We don&apos;t file appeals on your behalf on this screen.</p>
      </div>
    </section>
  );
}
