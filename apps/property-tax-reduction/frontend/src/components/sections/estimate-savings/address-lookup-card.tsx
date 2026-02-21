"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { MapPin, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover";
import { useAddressAutocomplete } from "@/hooks/use-address-autocomplete";

interface AddressLookupCardProps {
  address: string;
  initialApt?: string;
  isLoading: boolean;
  onLookup: (lookupAddress: string, displayAddress: string) => void;
  error?: string | null;
}

function buildFullAddress(baseAddress: string, unitNumber: string): string {
  const trimmed = baseAddress.trim();
  const unit = unitNumber.trim();
  if (!unit) return trimmed;
  // Split into parts and remove any existing "Unit ..." segments
  const parts = trimmed.split(", ");
  const filtered = parts.filter(
    (p) => !/^(unit|apt|suite|ste|#)\s/i.test(p.trim())
  );
  // Use "#" format which is more standard for Zillow
  if (filtered.length <= 1) return `${filtered[0]} #${unit}`;
  return [filtered[0] + ` #${unit}`, ...filtered.slice(1)].join(", ");
}

export function AddressLookupCard({
  address,
  initialApt = "",
  isLoading,
  onLookup,
  error,
}: AddressLookupCardProps) {
  const [inputAddress, setInputAddress] = useState(address);
  const [cleanAddress, setCleanAddress] = useState(address); // Address for API (no building name)
  const [unitNumber, setUnitNumber] = useState(initialApt);
  const [unitError, setUnitError] = useState(false);
  const [addressError, setAddressError] = useState(false);
  const [needsUnit, setNeedsUnit] = useState(!!initialApt);
  const [selectedFromAutocomplete, setSelectedFromAutocomplete] =
    useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isCollapsed, setIsCollapsed] = useState(true); // Start collapsed on mobile
  const [lastSubmittedBase, setLastSubmittedBase] = useState<string | null>(null);
  const [lastSubmittedUnit, setLastSubmittedUnit] = useState<string | null>(null);
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
    setInputAddress(address);
    setCleanAddress(address);
  }, [address]);

  useEffect(() => {
    setUnitNumber(initialApt);
    setNeedsUnit(!!initialApt);
  }, [initialApt]);

  const handleInputChange = (value: string) => {
    setInputAddress(value);
    setUnitError(false);
    setAddressError(false);
    if (selectedFromAutocomplete && value.trim() !== address.trim()) {
      setSelectedFromAutocomplete(false);
      setNeedsUnit(false);
      setUnitNumber("");
    }
    fetchSuggestions(value);
  };

  const handleSelectSuggestion = useCallback(
    async (placeId: string) => {
      const result = await selectSuggestion(placeId);
      if (!result) return;
      // Use cleanAddress for display to avoid Google's formatted address including units
      setInputAddress(result.cleanAddress || result.formattedAddress);
      setCleanAddress(result.cleanAddress); // Store clean address for API calls
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // If suggestions are showing, handle autocomplete navigation
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
    } else if (e.key === "Enter") {
      // No suggestions showing - trigger the submit
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleBlur = () => {
    setTimeout(() => {
      clearSuggestions();
      setHighlightedIndex(-1);
    }, 150);
  };

  const handleSubmit = () => {
    const trimmed = inputAddress.trim();
    setUnitError(false);
    setAddressError(false);

    if (!trimmed) {
      setAddressError(true);
      return;
    }

    if (selectedFromAutocomplete && needsUnit && !unitNumber.trim()) {
      setUnitError(true);
      return;
    }

    // Use cleanAddress (without building name) for API, not the display address
    const addressToUse = selectedFromAutocomplete ? cleanAddress : trimmed;
    const unitToUse = needsUnit ? unitNumber : "";
    setLastSubmittedBase(addressToUse);
    setLastSubmittedUnit(unitToUse);
    const fullAddress = buildFullAddress(addressToUse, unitToUse);
    // Pass both: full address (with unit) for the API, base address for display
    onLookup(fullAddress, addressToUse);
  };

  const currentBase = selectedFromAutocomplete ? cleanAddress : inputAddress.trim();
  const currentUnit = needsUnit ? unitNumber : "";
  const noChangesSinceSubmit =
    lastSubmittedBase !== null &&
    lastSubmittedBase === currentBase &&
    lastSubmittedUnit === currentUnit;
  const isButtonDisabled =
    isLoading || (noChangesSinceSubmit && !error);

  return (
    <section>
      <Card className="shadow-sm rounded-sm border-slate-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-slate-600" />
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-700">
              Property address
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="md:hidden p-1 hover:bg-slate-100 rounded transition-colors"
            aria-label={isCollapsed ? "Expand address form" : "Collapse address form"}
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
            <Label htmlFor="address">Address</Label>
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
                    id="address"
                    type="text"
                    value={inputAddress}
                    onChange={(e) =>
                      handleInputChange(e.target.value)
                    }
                    onKeyDown={handleKeyDown}
                    onBlur={handleBlur}
                    className="h-12 text-base"
                    placeholder="Enter address"
                    disabled={isLoading}
                    autoComplete="off"
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
                          i === highlightedIndex
                            ? "bg-slate-100"
                            : ""
                        }`}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleSelectSuggestion(s.placeId);
                        }}
                        onMouseEnter={() =>
                          setHighlightedIndex(i)
                        }
                      >
                        <span className="font-medium">
                          {s.mainText}
                        </span>
                        {s.secondaryText && (
                          <span className="ml-1 text-slate-500">
                            {s.secondaryText}
                          </span>
                        )}
                      </button>
                    ))
                  )}
                </div>
              </PopoverContent>
            </Popover>

            {needsUnit && (
              <div
                className="space-y-2 animate-in slide-in-from-top-2 duration-200"
                data-state={needsUnit ? "open" : "closed"}
              >
                <Label htmlFor="unit">
                  Apt #
                </Label>
                <Input
                  id="unit"
                  type="text"
                  value={unitNumber}
                  onChange={(e) => {
                    setUnitNumber(e.target.value);
                    setUnitError(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSubmit();
                    }
                  }}
                  className="h-12 text-base"
                  placeholder="eg. 5B, 101"
                  disabled={isLoading}
                />
              </div>
            )}

            <Button
              type="button"
              variant="default"
              size="default"
              className="h-12 w-full cursor-pointer"
              onClick={handleSubmit}
              disabled={isButtonDisabled}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Estimating...
                </>
              ) : (
                "Estimate Savings"
              )}
            </Button>

            {addressError && (
              <p className="text-sm text-red-600">
                Please enter a valid address.
              </p>
            )}
            {unitError && (
              <p className="text-sm text-red-600">
                Please enter your unit or apartment number.
              </p>
            )}
            {error && (
              <p className="text-sm text-red-600">
                {error} Retry the address or adjust values
                manually below.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
