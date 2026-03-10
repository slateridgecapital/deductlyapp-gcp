"use client";

import { Calculator } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { trackEvent } from "@/lib/analytics";

interface ValueComparisonSectionProps {
  assessedValue: number;
  marketValue: number;
  assessedTaxes: number;
  marketTaxes: number;
  taxRatePercent: number;
  isLoading?: boolean;
}

export function ValueComparisonSection({
  assessedValue,
  marketValue,
  assessedTaxes,
  marketTaxes,
  taxRatePercent,
  isLoading = false,
}: ValueComparisonSectionProps) {
  if (isLoading) {
    return (
      <section className="lg:self-start">
        <Card className="shadow-sm rounded-sm border-slate-200 gap-2">
          <CardHeader>
            <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
              <Calculator className="h-4 w-4" />
              Savings Estimate
            </span>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-3 w-full" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-3 w-full" />
            </div>
            <div className="border-t border-slate-200 pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-4 w-28" />
              </div>
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-4 w-28" />
              </div>
              <div className="flex items-center justify-between pt-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  const maxValue = Math.max(assessedValue, marketValue, 1);
  const assessedPercent = (assessedValue / maxValue) * 100;
  const marketPercent = (marketValue / maxValue) * 100;

  return (
    <section className="lg:self-start">
      <Card className="shadow-sm rounded-sm border-slate-200 gap-2 lg:pb-0">
        <CardHeader>
          <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
            <Calculator className="h-4 w-4" />
            Savings Estimate
          </span>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">County Assessed Value</span>
              <span className="font-semibold text-slate-900">
                ${assessedValue.toLocaleString('en-US')}
              </span>
            </div>
            <Progress value={assessedPercent} className="h-3 bg-slate-200" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Estimated Market Value</span>
              <span className="font-semibold text-slate-900">
                ${marketValue.toLocaleString('en-US')}
              </span>
            </div>
            <Progress
              value={marketPercent}
              className="h-3 bg-slate-200 [&>div]:bg-slate-900"
            />
          </div>

          <div className="border-t border-slate-200 pt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Taxes at Assessed Value</span>
              <div className="flex items-center gap-2">
                <span className="hidden md:inline text-xs text-slate-500 italic">
                  ${assessedValue.toLocaleString('en-US')} × {taxRatePercent}% =
                </span>
                <span className="font-semibold text-slate-900">
                  ${Math.round(assessedTaxes).toLocaleString('en-US')} <span className="md:hidden">/ yr</span><span className="hidden md:inline">/ year</span>
                </span>
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-slate-600">Taxes at Market Value</span>
              <div className="flex items-center gap-2">
                <span className="hidden md:inline text-xs text-slate-500 italic">
                  ${marketValue.toLocaleString('en-US')} × {taxRatePercent}% =
                </span>
                <span className="font-semibold text-slate-900">
                  ${Math.round(marketTaxes).toLocaleString('en-US')} <span className="md:hidden">/ yr</span><span className="hidden md:inline">/ year</span>
                </span>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-slate-600"><span className="md:hidden">Estimated Savings</span><span className="hidden md:inline">Estimated Annual Savings</span></span>
              {Math.round(Math.max(0, assessedTaxes - marketTaxes)) === 0 ? (
                <span className="font-semibold text-slate-900">
                  No savings found
                </span>
              ) : (
                <span className="font-semibold text-slate-900">
                  up to <span className="text-emerald-600">${Math.round(Math.max(0, assessedTaxes - marketTaxes)).toLocaleString('en-US')}{" "}
                  <span className="md:hidden text-slate-900">/ yr</span><span className="hidden md:inline text-slate-900">/ year</span></span>
                </span>
              )}
            </div>
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-slate-600"><span className="md:hidden">Estimated Savings %</span><span className="hidden md:inline">Estimated Savings Percentage</span></span>
              {Math.round(Math.max(0, assessedTaxes - marketTaxes)) === 0 ? (
                <span className="font-semibold text-slate-900">N/A</span>
              ) : (
                <span className="font-semibold text-slate-900">
                  up to <span className="text-emerald-600">{((Math.max(0, assessedTaxes - marketTaxes) / assessedTaxes) * 100).toFixed(1)}%</span>
                </span>
              )}
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-200 lg:hidden flex justify-end">
            <button
              type="button"
              onClick={() => {
                trackEvent("cta_get_plan_click", { source: "comparison" });
                document
                  .getElementById("let-us-take-it-form")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="text-sm text-slate-600 underline transition-colors hover:text-slate-900 cursor-pointer"
            >
              Get a free personalized plan
            </button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
