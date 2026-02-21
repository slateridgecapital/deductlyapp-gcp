"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useProgressSteps } from "@/hooks/use-progress-steps";
import { ResultHeadlineSection } from "./result-headline-section";
import { ValueComparisonSection } from "./value-comparison-section";
import { AdjustInputsPanel } from "./adjust-inputs-panel";
import { AddressLookupCard } from "./address-lookup-card";
import { DiyAppealGuideSection } from "./diy-appeal-guide-section";
import { FormulaBreakdownSection } from "./formula-breakdown-section";
import { TrustDisclaimerSection } from "./trust-disclaimer-section";

function buildFullAddress(baseAddress: string, unitNumber: string): string {
  const trimmed = baseAddress.trim();
  const unit = unitNumber.trim();
  if (!unit) return trimmed;
  const parts = trimmed.split(", ");
  const filtered = parts.filter(
    (p) => !/^(unit|apt|suite|ste|#)\s/i.test(p.trim())
  );
  if (filtered.length <= 1) return `${filtered[0]} #${unit}`;
  return [filtered[0] + ` #${unit}`, ...filtered.slice(1)].join(", ");
}

function parseAddressWithUnit(fullAddress: string): { base: string; unit: string } {
  const trimmed = fullAddress.trim();
  const unitMatch = trimmed.match(/#\s*([^,]+)/);
  if (unitMatch) {
    const unit = unitMatch[1].trim();
    const base = trimmed
      .replace(/\s*#\s*[^,]+/, "")
      .replace(/\s+/g, " ")
      .trim();
    return { base: base || trimmed, unit };
  }
  return { base: trimmed, unit: "" };
}

interface PropertyData {
  assessedValue: number;
  marketValue: number;
  taxRatePercent: number;
}

function getErrorMessage(code: string): string {
  switch (code) {
    case "PROPERTY_NOT_FOUND":
      return "We couldn't find that property. Please double-check the address and try again.";
    case "GATEWAY_TIMEOUT":
      return "The lookup timed out. Please try again in a moment.";
    case "SERVICE_UNAVAILABLE":
      return "Our data service is temporarily unavailable. Please try again shortly.";
    case "INVALID_INPUT":
      return "Please enter a valid property address.";
    default:
      return "Something went wrong. Please try again.";
  }
}

async function fetchAddressLookup(address: string): Promise<PropertyData> {
  const res = await fetch("/api/calculate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ address: address.trim() }),
  });
  const json = await res.json();

  if (!res.ok) {
    const code = json?.error?.code ?? "INTERNAL_ERROR";
    const message = json?.error?.message ?? getErrorMessage(code);
    throw new Error(JSON.stringify({ code, message }));
  }

  if (!json?.success || !json?.data?.calculations) {
    throw new Error(
      JSON.stringify({ code: "INTERNAL_ERROR", message: getErrorMessage("INTERNAL_ERROR") })
    );
  }

  const calc = json.data.calculations;
  const marketEstimate =
    calc.marketEstimate ?? json.data?.property?.marketEstimate;
  return {
    assessedValue: calc.currentAssessedValue ?? 0,
    marketValue: marketEstimate ?? 0,
    taxRatePercent: calc.taxRatePercent ?? 0,
  };
}

const OUR_ESTIMATE = {
  address: "123 Main St, Austin, TX 78701",
  assessedValue: 1_000_000,
  marketValue: 750_000,
  taxRatePercent: 1.88,
};

interface PreviousValues {
  address: string;
  assessedValue: number;
  marketValue: number;
  taxRatePercent: number;
}

export function EstimateSavingsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [address, setAddress] = useState("");
  const [assessedValue, setAssessedValue] = useState(OUR_ESTIMATE.assessedValue);
  const [marketValue, setMarketValue] = useState(OUR_ESTIMATE.marketValue);
  const [taxRatePercent, setTaxRatePercent] = useState(
    OUR_ESTIMATE.taxRatePercent
  );
  const [resetKey, setResetKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unitNumber, setUnitNumber] = useState("");
  const hasAutoLookedUpRef = useRef(false);

  const previousValuesRef = useRef<PreviousValues>({
    address: "",
    assessedValue: OUR_ESTIMATE.assessedValue,
    marketValue: OUR_ESTIMATE.marketValue,
    taxRatePercent: OUR_ESTIMATE.taxRatePercent,
  });
  const pendingDataRef = useRef<PropertyData | null>(null);
  const lastLookupAddressRef = useRef<string>("");
  const lastDisplayAddressRef = useRef<string>("");

  // Store the last successful lookup data for reset functionality
  const lastSuccessfulLookupRef = useRef<PreviousValues>({
    address: "",
    assessedValue: OUR_ESTIMATE.assessedValue,
    marketValue: OUR_ESTIMATE.marketValue,
    taxRatePercent: OUR_ESTIMATE.taxRatePercent,
  });

  const progress = useProgressSteps();

  const handleAddressLookup = useCallback(
    async (lookupAddress: string, displayAddress?: string) => {
      const display = displayAddress ?? lookupAddress;
      const parsed = parseAddressWithUnit(lookupAddress);
      setUnitNumber(parsed.unit);
      previousValuesRef.current = {
        address,
        assessedValue,
        marketValue,
        taxRatePercent,
      };
      lastLookupAddressRef.current = lookupAddress;
      lastDisplayAddressRef.current = display;
      setError(null);
      progress.start();
      setIsLoading(true);
      pendingDataRef.current = null;

      try {
        const data = await fetchAddressLookup(lookupAddress);
        pendingDataRef.current = data;
        progress.markDataReady();
      } catch (err) {
        progress.stop();
        setIsLoading(false);
        const message =
          err instanceof Error ? err.message : "Something went wrong. Please try again.";
        try {
          const parsed = JSON.parse(message) as { code?: string; message?: string };
          setError(parsed.message ?? getErrorMessage(parsed.code ?? "INTERNAL_ERROR"));
        } catch {
          setError(
            message.startsWith("{") ? getErrorMessage("INTERNAL_ERROR") : message
          );
        }
        const prev = previousValuesRef.current;
        setAddress(prev.address);
        setAssessedValue(prev.assessedValue);
        setMarketValue(prev.marketValue);
        setTaxRatePercent(prev.taxRatePercent);
        setResetKey((k) => k + 1);
      }
    },
    [address, assessedValue, marketValue, taxRatePercent, progress]
  );

  useEffect(() => {
    if (!progress.isComplete || !pendingDataRef.current) return;
    const data = pendingDataRef.current;
    const displayAddress = lastDisplayAddressRef.current;

    // Store successful lookup data for reset functionality
    lastSuccessfulLookupRef.current = {
      address: displayAddress,
      assessedValue: data.assessedValue,
      marketValue: data.marketValue,
      taxRatePercent: data.taxRatePercent,
    };

    const parsed = parseAddressWithUnit(lastLookupAddressRef.current);
    setAddress(displayAddress);
    setUnitNumber(parsed.unit);
    setAssessedValue(data.assessedValue);
    setMarketValue(data.marketValue);
    setTaxRatePercent(data.taxRatePercent);
    pendingDataRef.current = null;
    setIsLoading(false);
    progress.stop();
  }, [progress.isComplete]);

  // Auto-lookup address from URL parameters on page load
  useEffect(() => {
    if (hasAutoLookedUpRef.current) return;
    const addressParam = searchParams.get("address");
    const aptParam = searchParams.get("apt");
    if (addressParam?.trim()) {
      hasAutoLookedUpRef.current = true;
      const base = addressParam.trim();
      const apt = aptParam?.trim() || "";
      setAddress(base);
      setUnitNumber(apt);
      const fullAddress = apt ? buildFullAddress(base, apt) : base;
      handleAddressLookup(fullAddress, base);
    }
  }, [searchParams, handleAddressLookup]);

  const { assessedTaxes, marketTaxes, estimatedSavings, hasSavings } =
    useMemo(() => {
      const assessed = assessedValue * (taxRatePercent / 100);
      const market = marketValue * (taxRatePercent / 100);
      const savings = Math.max(0, assessed - market);
      return {
        assessedTaxes: assessed,
        marketTaxes: market,
        estimatedSavings: savings,
        hasSavings: savings > 0,
      };
    }, [assessedValue, marketValue, taxRatePercent]);

  const handleResetToCounty = () => {
    // Reset to last successful address lookup data
    const lastLookup = lastSuccessfulLookupRef.current;
    setAddress(lastLookup.address);
    setAssessedValue(lastLookup.assessedValue);
    setMarketValue(lastLookup.marketValue);
    setTaxRatePercent(lastLookup.taxRatePercent);
    setResetKey((k) => k + 1);
  };

  const handleResetToEstimate = () => {
    setAddress(OUR_ESTIMATE.address);
    setAssessedValue(OUR_ESTIMATE.assessedValue);
    setMarketValue(OUR_ESTIMATE.marketValue);
    setTaxRatePercent(OUR_ESTIMATE.taxRatePercent);
    setResetKey((k) => k + 1);
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 md:py-16">
      <ResultHeadlineSection
        hasSavings={hasSavings}
        estimatedSavings={estimatedSavings}
        isLoading={isLoading}
        progressPercent={progress.percent}
        progressStepLabel={progress.stepLabel}
        progressStepIndex={progress.currentStepIndex}
        progressTotalSteps={progress.totalSteps}
        isBottlenecked={progress.isBottlenecked}
      />

      {/* Side-by-side layout for comparison and inputs */}
      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-6">
          <AddressLookupCard
            address={address}
            initialApt={searchParams.get("apt") || unitNumber}
            isLoading={isLoading}
            onLookup={handleAddressLookup}
            error={error}
          />
          <AdjustInputsPanel
            key={resetKey}
            assessedValue={assessedValue}
            marketValue={marketValue}
            taxRatePercent={taxRatePercent}
            isLoading={isLoading}
            onAssessedValueChange={setAssessedValue}
            onMarketValueChange={setMarketValue}
            onTaxRatePercentChange={setTaxRatePercent}
            onResetToCounty={handleResetToCounty}
            onResetToEstimate={handleResetToEstimate}
          />
        </div>
        <div className="lg:col-span-2 space-y-6">
          <ValueComparisonSection
            assessedValue={assessedValue}
            marketValue={marketValue}
            assessedTaxes={assessedTaxes}
            marketTaxes={marketTaxes}
            taxRatePercent={taxRatePercent}
            isLoading={isLoading}
          />
        </div>
      </div>

      <DiyAppealGuideSection
        assessedValue={assessedValue}
        marketValue={marketValue}
        taxRatePercent={taxRatePercent}
        estimatedSavings={estimatedSavings}
      />

      <FormulaBreakdownSection
        assessedValue={assessedValue}
        marketValue={marketValue}
        taxRatePercent={taxRatePercent}
        assessedTaxes={assessedTaxes}
        marketTaxes={marketTaxes}
        estimatedSavings={estimatedSavings}
        isLoading={isLoading}
      />
      <TrustDisclaimerSection />
    </div>
  );
}
