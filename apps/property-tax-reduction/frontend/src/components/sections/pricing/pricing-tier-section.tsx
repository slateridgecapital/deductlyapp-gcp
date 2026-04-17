import Link from "next/link";
import { ArrowRight, CheckCircle, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const included = [
  "Property tax assessment document prepared for you to submit",
  "Identify missed tax exemptions and credits",
  "Find lower rates on insurance, utilities, and PMI",
];

const notIncluded = [
  "We prepare everything. You submit to your county.",
  "Filing, appeals, and hearings are not included.",
];

export function PricingTierSection() {
  return (
    <section className="bg-slate-50 px-4 py-16 md:py-24">
      <div className="container mx-auto max-w-6xl">
        <Card className="mx-auto w-full max-w-md shadow-lg ring-1 ring-slate-900/10">
          <CardContent className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <Badge className="bg-slate-900 text-white">Homeowner</Badge>
            </div>

            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-6xl tracking-[-1px] text-slate-900">
                  $59
                </span>
                <span className="text-lg text-slate-500">/year</span>
              </div>
              <p className="mt-1 text-sm font-medium uppercase tracking-wide text-slate-600">
                Flat annual fee
              </p>
            </div>

            <div className="space-y-3">
              <Button
                asChild
                className="h-12 w-full bg-slate-900 text-base font-medium hover:bg-slate-800"
              >
                <Link href="/estimate">
                  Estimate your savings
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <p className="text-center text-xs text-slate-500">
                No percentage of savings. No hidden fees. Ever.
              </p>
            </div>

            <div className="border-t border-slate-200 pt-6">
              <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-700">
                What&apos;s included
              </p>
              <ul className="space-y-3">
                {included.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                    <span className="text-sm leading-relaxed text-slate-700">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-slate-200 pt-6">
              <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Not included
              </p>
              <ul className="space-y-3">
                {notIncluded.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Minus className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                    <span className="text-sm leading-relaxed text-slate-500">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
