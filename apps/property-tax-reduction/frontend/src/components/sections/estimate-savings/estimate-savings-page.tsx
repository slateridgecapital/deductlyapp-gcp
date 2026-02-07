"use client";

import { useState, useMemo } from "react";
import { ResultHeadlineSection } from "./result-headline-section";
import { ValueComparisonSection } from "./value-comparison-section";
import { AdjustInputsPanel } from "./adjust-inputs-panel";
import { FormulaBreakdownSection } from "./formula-breakdown-section";
import { TrustDisclaimerSection } from "./trust-disclaimer-section";

const COUNTY_DATA = {
  address: "123 Main St, Austin, TX 78701",
  assessedValue: 1_000_000,
  marketValue: 950_000,
  taxRatePercent: 1.875,
};

const OUR_ESTIMATE = {
  address: "123 Main St, Austin, TX 78701",
  assessedValue: 1_000_000,
  marketValue: 750_000,
  taxRatePercent: 1.2,
};

export function EstimateSavingsPage() {
  const [address, setAddress] = useState(OUR_ESTIMATE.address);
  const [assessedValue, setAssessedValue] = useState(OUR_ESTIMATE.assessedValue);
  const [marketValue, setMarketValue] = useState(OUR_ESTIMATE.marketValue);
  const [taxRatePercent, setTaxRatePercent] = useState(
    OUR_ESTIMATE.taxRatePercent
  );
  const [resetKey, setResetKey] = useState(0);

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
    setAddress(COUNTY_DATA.address);
    setAssessedValue(COUNTY_DATA.assessedValue);
    setMarketValue(COUNTY_DATA.marketValue);
    setTaxRatePercent(COUNTY_DATA.taxRatePercent);
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
    <div className="container mx-auto max-w-7xl px-4 py-16 md:py-24">
      <ResultHeadlineSection
        hasSavings={hasSavings}
        estimatedSavings={estimatedSavings}
      />
      
      {/* Side-by-side layout for comparison and inputs */}
      <div className="mb-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <AdjustInputsPanel
            key={resetKey}
            address={address}
            assessedValue={assessedValue}
            marketValue={marketValue}
            taxRatePercent={taxRatePercent}
            onAddressChange={setAddress}
            onAssessedValueChange={setAssessedValue}
            onMarketValueChange={setMarketValue}
            onTaxRatePercentChange={setTaxRatePercent}
            onResetToCounty={handleResetToCounty}
            onResetToEstimate={handleResetToEstimate}
          />
        </div>
        <div className="lg:col-span-2">
          <ValueComparisonSection
            assessedValue={assessedValue}
            marketValue={marketValue}
            assessedTaxes={assessedTaxes}
            marketTaxes={marketTaxes}
            taxRatePercent={taxRatePercent}
          />
        </div>
      </div>

      <FormulaBreakdownSection
        assessedValue={assessedValue}
        marketValue={marketValue}
        taxRatePercent={taxRatePercent}
        assessedTaxes={assessedTaxes}
        marketTaxes={marketTaxes}
        estimatedSavings={estimatedSavings}
      />
      <TrustDisclaimerSection />
    </div>
  );
}
