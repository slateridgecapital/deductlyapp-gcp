"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, CheckCircle, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover";
import { useEffect, useRef, useState, useCallback } from "react";
import { useAddressAutocomplete } from "@/hooks/use-address-autocomplete";

export function HeroSection() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [inputAddress, setInputAddress] = useState("");
  const [cleanAddress, setCleanAddress] = useState("");
  const [unitNumber, setUnitNumber] = useState("");
  const [unitError, setUnitError] = useState(false);
  const [addressError, setAddressError] = useState(false);
  const [needsUnit, setNeedsUnit] = useState(false);
  const [selectedFromAutocomplete, setSelectedFromAutocomplete] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isNavigating, setIsNavigating] = useState(false);

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

  const handleInputChange = (value: string) => {
    setInputAddress(value);
    setUnitError(false);
    setAddressError(false);
    if (selectedFromAutocomplete && value.trim() !== inputAddress.trim()) {
      setSelectedFromAutocomplete(false);
      setNeedsUnit(false);
    }
    fetchSuggestions(value);
  };

  const handleSelectSuggestion = useCallback(
    async (placeId: string) => {
      const result = await selectSuggestion(placeId);
      if (!result) return;
      setInputAddress(result.cleanAddress || result.formattedAddress);
      setCleanAddress(result.cleanAddress);
      setNeedsUnit(result.needsUnit);
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

    const addressToUse = selectedFromAutocomplete ? cleanAddress : trimmed;

    setIsNavigating(true);
    const params = new URLSearchParams();
    params.set("address", addressToUse);
    if (unitNumber.trim()) {
      params.set("apt", unitNumber.trim());
    }
    router.push(`/estimate?${params.toString()}`);
  };

  const isSubmitDisabled = isNavigating;

  useEffect(() => {
    // Ensure video plays and set playback speed
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.65; // 65% speed
      videoRef.current.play().catch((error) => {
        console.log("Video autoplay failed:", error);
      });
    }
  }, []);

  return (
    <section className="relative overflow-hidden px-4 py-16 md:py-24">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="h-full w-full object-cover opacity-40"
          style={{
            transform: 'scale(1.1) translateZ(0)',
            animation: 'slowPan 6000s ease infinite alternate',
            willChange: 'transform',
            backfaceVisibility: 'hidden',
            perspective: 1000,
          }}
          onLoadedData={() => console.log("Video loaded successfully")}
          onError={(e) => console.error("Video error:", e)}
        >
          <source src="/videos/hero-bg.mp4" type="video/mp4" />
        </video>
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50/40 to-white/50" />
      </div>

      <div className="container relative z-10 mx-auto max-w-4xl text-center">
        {/* Headline */}
        <h1 className="mb-6 font-serif text-[32px] leading-tight tracking-[-1px] text-slate-900 md:text-5xl lg:text-6xl">
          Home prices fell.
          <br />
          <em>Your</em> property taxes didn&apos;t.
        </h1>

        {/* Subheadline */}
        <p className="mx-auto mb-10 max-w-2xl text-lg text-slate-600">
          Within seconds, we compare your tax assessment to today&apos;s market to see if you could lower your taxes.
        </p>

        {/* Property Search Card */}
        <Card className="mx-auto max-w-[500px] shadow-lg rounded-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-slate-600" />
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-700">
                Property Search
              </span>
            </div>
            <Badge
              variant="secondary"
              className="bg-emerald-50 text-emerald-700 hidden lg:inline-flex"
            >
              <CheckCircle className="mr-1 h-3 w-3" />
              Saved $100k+ in taxes so far
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
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
                    type="text"
                    value={inputAddress}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={handleBlur}
                    placeholder="Enter address..."
                    className="h-12 text-base"
                    disabled={isNavigating}
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

            {addressError && (
              <p className="text-sm text-red-600">
                Please enter a valid address.
              </p>
            )}

            {needsUnit && (
              <div
                className="space-y-2 animate-in slide-in-from-top-2 duration-200"
                data-state={needsUnit ? "open" : "closed"}
              >
                <Label htmlFor="hero-unit">Apt #</Label>
                <Input
                  id="hero-unit"
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
                  disabled={isNavigating}
                />
                {unitError && (
                  <p className="text-sm text-red-600">
                    Please enter your unit or apartment number.
                  </p>
                )}
              </div>
            )}

            <Button
              type="button"
              className="h-12 w-full bg-slate-900 text-base font-medium hover:bg-slate-800 cursor-pointer"
              onClick={handleSubmit}
              disabled={isSubmitDisabled}
            >
              {isNavigating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  Estimate Savings
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>

            <p className="text-xs text-slate-500">
              Or enter values{" "}
              <Link href="/estimate" className="underline hover:text-slate-700">
                manually
              </Link>{" "}
              to estimate savings
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
