"use client";

import { useState, useCallback, useEffect } from "react";
import { Settings2, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

const MIN_VALUE = 0;
const MAX_VALUE = 100_000_000;
const MIN_TAX_RATE = 0;
const MAX_TAX_RATE = 5;

function parseFormattedNumber(value: string): number {
  const cleaned = value.replace(/,/g, "");
  const parsed = parseInt(cleaned, 10);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function formatNumber(value: number): string {
  if (value === 0) return "";
  return value.toLocaleString('en-US');
}

interface AdjustInputsPanelProps {
  assessedValue: number;
  marketValue: number;
  taxRatePercent: number;
  isLoading?: boolean;
  onAssessedValueChange: (v: number) => void;
  onMarketValueChange: (v: number) => void;
  onTaxRatePercentChange: (v: number) => void;
  onResetToCounty: () => void;
  onResetToEstimate: () => void;
}

export function AdjustInputsPanel({
  assessedValue,
  marketValue,
  taxRatePercent,
  isLoading = false,
  onAssessedValueChange,
  onMarketValueChange,
  onTaxRatePercentChange,
  onResetToCounty,
  onResetToEstimate,
}: AdjustInputsPanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(true); // Start collapsed on mobile

  if (isLoading) {
    return (
      <section>
        <Card className="shadow-sm rounded-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
            <div className="flex items-center gap-2">
              <Settings2 className="h-4 w-4 text-slate-600" />
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-700">
                Adjust inputs
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="md:hidden p-1 hover:bg-slate-100 rounded transition-colors"
              aria-label={isCollapsed ? "Expand adjust inputs" : "Collapse adjust inputs"}
            >
              {isCollapsed ? (
                <ChevronDown className="h-5 w-5 text-slate-600" />
              ) : (
                <ChevronUp className="h-5 w-5 text-slate-600" />
              )}
            </button>
          </CardHeader>
          <CardContent className={`space-y-4 ${isCollapsed ? "hidden md:block" : "block"}`}>
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-11 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-11 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-11 w-full" />
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              <Skeleton className="h-8 w-16" />
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  const [assessedInput, setAssessedInput] = useState(formatNumber(assessedValue));
  const [marketInput, setMarketInput] = useState(formatNumber(marketValue));
  const [taxRateInput, setTaxRateInput] = useState(
    taxRatePercent % 1 === 0 ? String(taxRatePercent) : taxRatePercent.toFixed(2)
  );

  const [assessedError, setAssessedError] = useState<string | null>(null);
  const [marketError, setMarketError] = useState<string | null>(null);
  const [taxRateError, setTaxRateError] = useState<string | null>(null);

  // Track previous values to detect external changes
  const [prevAssessedValue, setPrevAssessedValue] = useState(assessedValue);
  const [prevMarketValue, setPrevMarketValue] = useState(marketValue);
  const [prevTaxRatePercent, setPrevTaxRatePercent] = useState(taxRatePercent);

  // Sync local state with props only when they change externally (e.g., from Reset button)
  useEffect(() => {
    if (assessedValue !== prevAssessedValue) {
      setAssessedInput(formatNumber(assessedValue));
      setPrevAssessedValue(assessedValue);
    }
  }, [assessedValue, prevAssessedValue]);

  useEffect(() => {
    if (marketValue !== prevMarketValue) {
      setMarketInput(formatNumber(marketValue));
      setPrevMarketValue(marketValue);
    }
  }, [marketValue, prevMarketValue]);

  useEffect(() => {
    if (taxRatePercent !== prevTaxRatePercent) {
      setTaxRateInput(
        taxRatePercent % 1 === 0 ? String(taxRatePercent) : taxRatePercent.toFixed(2)
      );
      setPrevTaxRatePercent(taxRatePercent);
    }
  }, [taxRatePercent, prevTaxRatePercent]);

  const validateAndApplyAssessed = useCallback(
    (raw: string) => {
      setAssessedInput(raw);
      const num = parseFormattedNumber(raw);
      if (raw.trim() === "") {
        setAssessedError("Enter a value");
        return;
      }
      if (num < MIN_VALUE || num > MAX_VALUE) {
        setAssessedError(`Enter a value between ${MIN_VALUE.toLocaleString('en-US')} and ${MAX_VALUE.toLocaleString('en-US')}`);
        return;
      }
      setAssessedError(null);
      setPrevAssessedValue(num); // Track this as our own change
      onAssessedValueChange(num);
    },
    [onAssessedValueChange]
  );

  const validateAndApplyMarket = useCallback(
    (raw: string) => {
      setMarketInput(raw);
      const num = parseFormattedNumber(raw);
      if (raw.trim() === "") {
        setMarketError("Enter a value");
        return;
      }
      if (num < MIN_VALUE || num > MAX_VALUE) {
        setMarketError(`Enter a value between ${MIN_VALUE.toLocaleString('en-US')} and ${MAX_VALUE.toLocaleString('en-US')}`);
        return;
      }
      setMarketError(null);
      setPrevMarketValue(num); // Track this as our own change
      onMarketValueChange(num);
    },
    [onMarketValueChange]
  );

  const validateAndApplyTaxRate = useCallback(
    (raw: string) => {
      setTaxRateInput(raw);
      const num = parseFloat(raw.replace(/,/g, ""));
      if (raw.trim() === "") {
        setTaxRateError("Enter a rate");
        return;
      }
      if (Number.isNaN(num) || num < MIN_TAX_RATE || num > MAX_TAX_RATE) {
        setTaxRateError(`Enter a rate between ${MIN_TAX_RATE}% and ${MAX_TAX_RATE}%`);
        return;
      }
      setTaxRateError(null);
      setPrevTaxRatePercent(num); // Track this as our own change
      onTaxRatePercentChange(num);
    },
    [onTaxRatePercentChange]
  );

  const handleTaxRateBlur = useCallback(() => {
    const num = parseFloat(taxRateInput.replace(/,/g, ""));
    if (!Number.isNaN(num) && num >= MIN_TAX_RATE && num <= MAX_TAX_RATE) {
      // Format nicely when user is done typing
      const formatted = num % 1 === 0 ? String(num) : num.toFixed(2);
      setTaxRateInput(formatted);
    }
  }, [taxRateInput]);

  const handleResetToCounty = () => {
    setAssessedError(null);
    setMarketError(null);
    setTaxRateError(null);
    onResetToCounty();
  };

  const handleResetToEstimate = () => {
    setAssessedError(null);
    setMarketError(null);
    setTaxRateError(null);
    onResetToEstimate();
  };

  return (
    <section>
      <Card className="shadow-sm rounded-sm border-slate-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
          <div className="flex items-center gap-2">
            <Settings2 className="h-4 w-4 text-slate-600" />
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-700">
              Adjust inputs
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="md:hidden p-1 hover:bg-slate-100 rounded transition-colors"
            aria-label={isCollapsed ? "Expand adjust inputs" : "Collapse adjust inputs"}
          >
            {isCollapsed ? (
              <ChevronDown className="h-5 w-5 text-slate-600" />
            ) : (
              <ChevronUp className="h-5 w-5 text-slate-600" />
            )}
          </button>
        </CardHeader>
        <CardContent className={`space-y-4 ${isCollapsed ? "hidden md:block" : "block"}`}>
          <div className="space-y-2">
            <Label htmlFor="assessed">County Assessed Value</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                $
              </span>
              <Input
                id="assessed"
                type="text"
                inputMode="numeric"
                value={assessedInput}
                onChange={(e) => validateAndApplyAssessed(e.target.value)}
                className="h-11 pl-8"
                placeholder="e.g. 1000000"
                aria-invalid={!!assessedError}
              />
            </div>
            {assessedError && (
              <p className="text-xs text-red-600">{assessedError}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="market">Estimated Market Value</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                $
              </span>
              <Input
                id="market"
                type="text"
                inputMode="numeric"
                value={marketInput}
                onChange={(e) => validateAndApplyMarket(e.target.value)}
                className="h-11 pl-8"
                placeholder="e.g. 750000"
                aria-invalid={!!marketError}
              />
            </div>
            {marketError && (
              <p className="text-xs text-red-600">{marketError}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="taxRate">Property Tax Rate</Label>
            <div className="relative">
              <Input
                id="taxRate"
                type="text"
                inputMode="decimal"
                value={taxRateInput}
                onChange={(e) => validateAndApplyTaxRate(e.target.value)}
                onBlur={handleTaxRateBlur}
                className="h-11 pr-8"
                placeholder="e.g. 1.2"
                aria-invalid={!!taxRateError}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                %
              </span>
            </div>
            {taxRateError && (
              <p className="text-xs text-red-600">{taxRateError}</p>
            )}
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleResetToCounty}
            >
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
