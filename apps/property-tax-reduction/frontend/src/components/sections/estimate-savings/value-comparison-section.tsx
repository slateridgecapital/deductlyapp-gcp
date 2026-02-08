"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

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
      <section>
        <Card className="shadow-sm rounded-sm border-slate-200">
          <CardHeader>
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">
              Valuation Comparison
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
    <section>
      <Card className="shadow-sm rounded-sm border-slate-200">
        <CardHeader>
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">
            Valuation Comparison
          </span>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">County Assessed Value</span>
              <span className="font-semibold text-slate-900">
                ${assessedValue.toLocaleString()}
              </span>
            </div>
            <Progress value={assessedPercent} className="h-3 bg-slate-200" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Estimated Market Value</span>
              <span className="font-semibold text-slate-900">
                ${marketValue.toLocaleString()}
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
                <span className="text-xs text-slate-500 italic">
                  ${assessedValue.toLocaleString()} × {taxRatePercent}% =
                </span>
                <span className="font-semibold text-slate-900">
                  ${Math.round(assessedTaxes).toLocaleString()} / year
                </span>
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-slate-600">Taxes at Market Value</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 italic">
                  ${marketValue.toLocaleString()} × {taxRatePercent}% =
                </span>
                <span className="font-semibold text-slate-900">
                  ${Math.round(marketTaxes).toLocaleString()} / year
                </span>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-slate-600">Estimated Annual Savings</span>
              {Math.round(Math.max(0, assessedTaxes - marketTaxes)) === 0 ? (
                <span className="font-semibold text-slate-900">
                  No savings found
                </span>
              ) : (
                <span className="font-semibold text-emerald-600">
                  $
                  {Math.round(Math.max(0, assessedTaxes - marketTaxes)).toLocaleString()}{" "}
                  / year
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
