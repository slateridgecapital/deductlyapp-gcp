import { Wallet, FileCheck2, RotateCcw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const steps = [
  {
    number: 1,
    icon: Wallet,
    label: "Today",
    description: "Pay the flat $59 annual fee.",
  },
  {
    number: 2,
    icon: FileCheck2,
    label: "After submission",
    description: "Your county reviews the assessment.",
  },
  {
    number: 3,
    icon: RotateCcw,
    label: "No savings?",
    description: "Get a full refund.",
  },
];

export function PricingGuaranteeSection() {
  return (
    <section className="bg-slate-100 px-4 py-16 md:py-24">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-slate-900 md:text-4xl">
            The Deductly Guarantee
          </h2>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-slate-600">
            If your property tax assessment comes back with no savings, we
            refund your $59 in <em>full</em>. No partial credit. No fine print.
            No waiting a year.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step) => (
            <Card key={step.number} className="h-full shadow-sm">
              <CardContent className="flex h-full flex-col items-start gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                    {step.number}
                  </div>
                  <step.icon className="h-5 w-5 text-slate-500" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {step.label}
                  </p>
                  <p className="mt-1 text-base font-medium leading-relaxed text-slate-900">
                    {step.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
