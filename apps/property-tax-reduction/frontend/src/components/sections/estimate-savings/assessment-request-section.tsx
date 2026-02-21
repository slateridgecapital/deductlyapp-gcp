"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover";
import { useAddressAutocomplete } from "@/hooks/use-address-autocomplete";

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

function parseAddressWithUnit(fullAddress: string): {
  base: string;
  unit: string;
} {
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

interface AssessmentRequestFormProps {
  address: string;
  initialApt?: string;
  assessedValue: number;
  marketValue: number;
  taxRatePercent: number;
  estimatedSavings: number;
  onSubmitSuccess: () => void;
}

export function AssessmentRequestForm({
  address,
  initialApt = "",
  assessedValue,
  marketValue,
  taxRatePercent,
  estimatedSavings,
  onSubmitSuccess,
}: AssessmentRequestFormProps) {
  const parsed = parseAddressWithUnit(address);
  const [inputAddress, setInputAddress] = useState(parsed.base || address);
  const [cleanAddress, setCleanAddress] = useState(parsed.base || address);
  const [unitNumber, setUnitNumber] = useState(parsed.unit || initialApt);
  const [needsUnit, setNeedsUnit] = useState(!!(parsed.unit || initialApt));
  const [selectedFromAutocomplete, setSelectedFromAutocomplete] =
    useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addressError, setAddressError] = useState(false);
  const [unitError, setUnitError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    suggestions,
    isLoadingSuggestions,
    fetchSuggestions,
    selectSuggestion,
    clearSuggestions,
    resetSessionToken,
  } = useAddressAutocomplete();

  const showPopover =
    (suggestions.length > 0 || isLoadingSuggestions) &&
    inputAddress.trim().length >= 3;

  useEffect(() => {
    const p = parseAddressWithUnit(address);
    setInputAddress(p.base || address);
    setCleanAddress(p.base || address);
    setUnitNumber(p.unit || initialApt);
    setNeedsUnit(!!(p.unit || initialApt));
  }, [address, initialApt]);

  const handleInputChange = (value: string) => {
    if (selectedFromAutocomplete && value.trim() !== inputAddress.trim()) {
      setSelectedFromAutocomplete(false);
      setNeedsUnit(false);
      setUnitNumber("");
    }
    setInputAddress(value);
    setAddressError(false);
    setUnitError(false);
    fetchSuggestions(value);
  };

  const handleSelectSuggestion = useCallback(
    async (placeId: string) => {
      const result = await selectSuggestion(placeId);
      if (!result) return;
      setInputAddress(result.cleanAddress || result.formattedAddress);
      setCleanAddress(result.cleanAddress);
      setNeedsUnit(result.needsUnit);
      if (!result.needsUnit) {
        setUnitNumber("");
      }
      setSelectedFromAutocomplete(true);
      clearSuggestions();
      resetSessionToken();
      setHighlightedIndex(-1);
      setUnitError(false);
      inputRef.current?.blur();
    },
    [selectSuggestion, clearSuggestions, resetSessionToken]
  );

  const handleAddressKeyDown = (e: React.KeyboardEvent) => {
    if (showPopover && suggestions.length > 0) {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setHighlightedIndex((i) =>
            i < suggestions.length - 1 ? i + 1 : i
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightedIndex((i) => (i > 0 ? i - 1 : -1));
          break;
        case "Enter":
          e.preventDefault();
          if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
            handleSelectSuggestion(suggestions[highlightedIndex].placeId);
          }
          break;
        case "Escape":
          clearSuggestions();
          setHighlightedIndex(-1);
          break;
      }
    }
  };

  const handleBlur = () => {
    setTimeout(() => {
      clearSuggestions();
      setHighlightedIndex(-1);
    }, 150);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setAddressError(false);
    setUnitError(false);

    const trimmed = inputAddress.trim();
    if (!trimmed) {
      setAddressError(true);
      return;
    }
    if (selectedFromAutocomplete && needsUnit && !unitNumber.trim()) {
      setUnitError(true);
      return;
    }

    const addressToUse = selectedFromAutocomplete ? cleanAddress : trimmed;
    const unitToUse = needsUnit ? unitNumber : "";
    const fullAddress = buildFullAddress(addressToUse, unitToUse);

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/submit-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: fullAddress,
          name: name.trim(),
          email: email.trim(),
          assessedValue,
          marketValue,
          taxRatePercent,
          estimatedSavings,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json?.error?.message ?? "Something went wrong. Please try again.");
        setIsSubmitting(false);
        return;
      }

      onSubmitSuccess();
    } catch {
      setError("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="request-address">Address</Label>
        <Popover
          open={showPopover}
          onOpenChange={(open) => {
            if (!open) clearSuggestions();
          }}
        >
          <PopoverAnchor asChild>
            <div className="relative">
              <Input
                ref={inputRef}
                id="request-address"
                type="text"
                value={inputAddress}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={handleAddressKeyDown}
                onBlur={handleBlur}
                placeholder="Enter address..."
                autoComplete="off"
                className="w-full h-10"
              />
            </div>
          </PopoverAnchor>
          <PopoverContent
            className="w-[var(--radix-popover-trigger-width)] p-0"
            align="start"
            sideOffset={4}
            onOpenAutoFocus={(e) => e.preventDefault()}
            onCloseAutoFocus={(e) => e.preventDefault()}
          >
            <div className="max-h-60 overflow-auto py-1">
              {isLoadingSuggestions ? (
                <div className="flex items-center justify-center gap-2 px-4 py-6 text-sm text-slate-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Searching...
                </div>
              ) : (
                suggestions.map((s, i) => (
                  <button
                    key={s.placeId}
                    type="button"
                    className={`w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-slate-100 ${
                      i === highlightedIndex ? "bg-slate-100" : ""
                    }`}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSelectSuggestion(s.placeId);
                    }}
                    onMouseEnter={() => setHighlightedIndex(i)}
                  >
                    <span className="font-medium">{s.mainText}</span>
                    {s.secondaryText && (
                      <span className="ml-1 text-slate-500">{s.secondaryText}</span>
                    )}
                  </button>
                ))
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {needsUnit && (
        <div
          className="space-y-2 animate-in slide-in-from-top-2 duration-200"
          data-state={needsUnit ? "open" : "closed"}
        >
          <Label htmlFor="request-unit">Apt #</Label>
          <Input
            id="request-unit"
            type="text"
            value={unitNumber}
            onChange={(e) => {
              setUnitNumber(e.target.value);
              setUnitError(false);
            }}
            placeholder="eg. 5B, 101"
            className="w-full h-10"
          />
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="request-name">Name</Label>
        <Input
          id="request-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your full name"
          required
          className="w-full"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="request-email">Email</Label>
        <Input
          id="request-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          className="w-full"
        />
      </div>
      {addressError && (
        <p className="text-sm text-red-600">Please enter a valid address.</p>
      )}
      {unitError && (
        <p className="text-sm text-red-600">Please enter your unit or apartment number.</p>
      )}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs font-semibold text-muted-foreground">
          No filings or commitments until you&apos;re ready.
        </p>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="shrink-0 w-full sm:w-auto"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            "Submit"
          )}
        </Button>
      </div>
    </form>
  );
}
