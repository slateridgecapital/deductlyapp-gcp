"use client";

import { TrendingDown, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ResultHeadlineSectionProps {
  hasSavings: boolean;
  estimatedSavings: number;
}

export function ResultHeadlineSection({
  hasSavings,
  estimatedSavings,
}: ResultHeadlineSectionProps) {
  return (
    <section className="mb-12 text-center">
      {hasSavings ? (
        <>
          <Badge
            className="mb-4 w-fit bg-emerald-50 text-emerald-700 hover:bg-emerald-50"
            variant="secondary"
          >
            <CheckCircle className="mr-1.5 h-3 w-3" />
            Potential savings found
          </Badge>
          <h1 className="mb-4 font-serif text-3xl leading-tight tracking-[-1px] text-slate-900 md:text-4xl">
            You could save up to{" "}
            <span className="text-emerald-600">
              ${Math.round(estimatedSavings).toLocaleString()}
            </span>{" "}
            per year
          </h1>
          <p className="mx-auto max-w-xl text-lg text-slate-600">
            Based on current data, your property may be over-assessed compared
            to today&apos;s market value. The estimate below shows what a
            reduced assessment could mean for your annual tax bill.
          </p>
        </>
      ) : (
        <>
          <Badge
            className="mb-4 w-fit bg-slate-100 text-slate-700 hover:bg-slate-100"
            variant="secondary"
          >
            <TrendingDown className="mr-1.5 h-3 w-3" />
            No potential savings
          </Badge>
          <h1 className="mb-4 font-serif text-3xl leading-tight tracking-[-1px] text-slate-900 md:text-4xl">
            Your assessment looks in line
          </h1>
          <p className="mx-auto max-w-xl text-lg text-slate-600">
            Your assessment appears to be in line with or below current market
            value. You can adjust the inputs below to explore different
            scenarios.
          </p>
        </>
      )}
    </section>
  );
}
