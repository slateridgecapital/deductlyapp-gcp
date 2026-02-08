"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type { AutocompletePrediction } from "@/app/api/places/autocomplete/route";

export interface PlaceSelectionResult {
  formattedAddress: string;
  cleanAddress: string; // Address without building name for Zillow
  needsUnit: boolean;
}

const DEBOUNCE_MS = 300;
const MIN_INPUT_LENGTH = 3;

function generateSessionToken(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

export function useAddressAutocomplete() {
  const [suggestions, setSuggestions] = useState<AutocompletePrediction[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  const sessionTokenRef = useRef<string>(generateSessionToken());
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getSessionToken = useCallback(() => {
    const token = sessionTokenRef.current;
    sessionTokenRef.current = generateSessionToken();
    return token;
  }, []);

  const resetSessionToken = useCallback(() => {
    sessionTokenRef.current = generateSessionToken();
  }, []);

  const fetchSuggestions = useCallback(async (input: string) => {
    const trimmed = input.trim();
    if (trimmed.length < MIN_INPUT_LENGTH) {
      setSuggestions([]);
      return;
    }

    setIsLoadingSuggestions(true);
    setSuggestions([]);

    try {
      const res = await fetch("/api/places/autocomplete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: trimmed,
          sessionToken: sessionTokenRef.current,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setSuggestions([]);
        return;
      }

      if (json?.success && Array.isArray(json?.suggestions)) {
        setSuggestions(json.suggestions);
      }
    } catch {
      setSuggestions([]);
    } finally {
      setIsLoadingSuggestions(false);
    }
  }, []);

  const debouncedFetch = useCallback(
    (input: string) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }

      const trimmed = input.trim();
      if (trimmed.length < MIN_INPUT_LENGTH) {
        setSuggestions([]);
        return;
      }

      debounceRef.current = setTimeout(() => {
        debounceRef.current = null;
        fetchSuggestions(input);
      }, DEBOUNCE_MS);
    },
    [fetchSuggestions]
  );

  const selectSuggestion = useCallback(
    async (placeId: string): Promise<PlaceSelectionResult | null> => {
      const sessionToken = getSessionToken();

      try {
        const res = await fetch("/api/places/details", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            placeId,
            sessionToken,
          }),
        });

        const json = await res.json();

        if (!res.ok || !json?.success || !json?.data) {
          return null;
        }

        return {
          formattedAddress: json.data.formattedAddress ?? "",
          cleanAddress: json.data.cleanAddress ?? json.data.formattedAddress ?? "",
          needsUnit: Boolean(json.data.needsUnit),
        };
      } catch {
        return null;
      }
    },
    [getSessionToken]
  );

  const clearSuggestions = useCallback(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    setSuggestions([]);
  }, []);

  useEffect(() => () => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
  }, []);

  return {
    suggestions,
    isLoadingSuggestions,
    fetchSuggestions: debouncedFetch,
    selectSuggestion,
    clearSuggestions,
    resetSessionToken,
  };
}
