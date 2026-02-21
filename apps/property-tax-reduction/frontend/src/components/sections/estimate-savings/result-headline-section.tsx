"use client";

import { Progress } from "@/components/ui/progress";

interface ResultHeadlineSectionProps {
  hasSavings: boolean;
  estimatedSavings: number;
  isLoading?: boolean;
  progressPercent?: number;
  progressStepLabel?: string;
  progressStepIndex?: number;
  progressTotalSteps?: number;
  isBottlenecked?: boolean;
}

export function ResultHeadlineSection({
  hasSavings,
  estimatedSavings,
  isLoading = false,
  progressPercent = 0,
  progressStepLabel = "",
  progressStepIndex = 0,
  progressTotalSteps = 8,
  isBottlenecked = false,
}: ResultHeadlineSectionProps) {
  if (isLoading) {
    return (
      <section className="mb-8 text-center">
        <h2 className="mb-4 text-lg font-medium text-slate-700">
          Analyzing your property
        </h2>
        <div className="mx-auto max-w-md space-y-3">
          <Progress value={progressPercent} className="h-2" />
          <p
            className={
              isBottlenecked
                ? "animate-pulse text-sm text-amber-600"
                : "text-sm text-slate-600"
            }
          >
            {isBottlenecked
              ? "Taking a bit longer than expected — hang tight, we're working on it..."
              : progressStepLabel}
          </p>
          {!isBottlenecked && progressTotalSteps > 0 && (
            <p className="text-xs text-slate-500">
              Step {progressStepIndex + 1} of {progressTotalSteps}
            </p>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="mb-8 text-center">
      {hasSavings ? (
        <>
          <h1 className="mb-4 font-serif text-[28px] leading-tight tracking-[-1px] text-slate-900 lg:text-4xl">
            You could save up to{" "}
            <span className="text-emerald-600">
              ${Math.round(estimatedSavings).toLocaleString('en-US')}
            </span>{" "}
            per year
          </h1>
          <p className="mx-auto max-w-xl text-base text-slate-600 lg:text-lg">
            Based on our analysis, you may be overpaying due to an inflated
            assessment. Here&apos;s what a correction could save you each year.
          </p>
        </>
      ) : (
        <>
          <h1 className="mb-4 font-serif text-3xl leading-tight tracking-[-1px] text-slate-900 md:text-4xl">
            Your assessment looks in line
          </h1>
          <p className="mx-auto max-w-xl text-base text-slate-600 lg:text-lg">
            Your assessment appears to be in line with or below current market
            value. You can adjust the inputs below to explore different
            scenarios.
          </p>
        </>
      )}
    </section>
  );
}
