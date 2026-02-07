"use client";

import { Calculator, HelpCircle } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FormulaBreakdownSectionProps {
  assessedValue: number;
  marketValue: number;
  taxRatePercent: number;
  assessedTaxes: number;
  marketTaxes: number;
  estimatedSavings: number;
}

export function FormulaBreakdownSection({
  assessedValue,
  marketValue,
  taxRatePercent,
  assessedTaxes,
  marketTaxes,
  estimatedSavings,
}: FormulaBreakdownSectionProps) {
  const assessedRounded = Math.round(assessedTaxes);
  const marketRounded = Math.round(marketTaxes);
  const savingsRounded = Math.round(estimatedSavings);

  return (
    <section className="mb-12">
      <Card className="bg-slate-50/80 shadow-sm rounded-sm border-slate-200">
        <CardHeader className="flex flex-row items-center gap-2">
          <Calculator className="h-4 w-4 text-slate-600" />
          <span className="text-sm font-semibold text-slate-800">
            How we calculate this
          </span>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2 text-sm text-slate-600">
            <p className="font-medium text-slate-700">Formulas</p>
            <ul className="list-inside list-disc space-y-1 pl-1">
              <li>Estimated annual taxes = Value × Property tax rate</li>
              <li>
                Estimated savings = (Assessed value × Tax rate) − (Market value ×
                Tax rate)
              </li>
            </ul>
          </div>

          <div className="space-y-3 border-t border-slate-200 pt-4">
            <p className="text-sm font-medium text-slate-700">
              Step-by-step with your numbers
            </p>
            <div className="space-y-2 font-mono text-sm text-slate-700">
              <p>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="inline-flex cursor-help items-center gap-1 underline decoration-dotted">
                        Assessed value
                        <HelpCircle className="h-3 w-3 text-slate-500" />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs">
                      The value your county uses to calculate your property
                      taxes. It may be updated periodically and can differ from
                      current market value.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                {" "}taxes = ${assessedValue.toLocaleString()} × {taxRatePercent}% = $
                {assessedRounded.toLocaleString()}
              </p>
              <p>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="inline-flex cursor-help items-center gap-1 underline decoration-dotted">
                        Market value
                        <HelpCircle className="h-3 w-3 text-slate-500" />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs">
                      An estimate of what your property would sell for today,
                      based on recent sales and market indicators. We use this
                      to compare against the county&apos;s assessed value.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                {" "}taxes = ${marketValue.toLocaleString()} × {taxRatePercent}% = $
                {marketRounded.toLocaleString()}
              </p>
              <p>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="inline-flex cursor-help items-center gap-1 underline decoration-dotted">
                        Tax rate
                        <HelpCircle className="h-3 w-3 text-slate-500" />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs">
                      The percentage of your property&apos;s value that you pay
                      in taxes each year. It varies by county and can include
                      city, school, and other local rates.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                {" "}— Estimated savings = ${assessedRounded.toLocaleString()} − $
                {marketRounded.toLocaleString()} = $
                {savingsRounded.toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
