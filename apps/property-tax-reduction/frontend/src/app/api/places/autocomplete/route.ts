import { NextRequest, NextResponse } from "next/server";

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const AUTOCOMPLETE_URL = "https://places.googleapis.com/v1/places:autocomplete";

export interface AutocompletePrediction {
  placeId: string;
  mainText: string;
  secondaryText: string;
  types: string[];
}

export async function POST(request: NextRequest) {
  try {
    if (!GOOGLE_PLACES_API_KEY) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "SERVICE_UNAVAILABLE",
            message: "Address autocomplete is not configured.",
          },
        },
        { status: 503 }
      );
    }

    const body = await request.json();
    const input =
      typeof body?.input === "string" ? body.input.trim() : "";
    const sessionToken =
      typeof body?.sessionToken === "string" ? body.sessionToken : undefined;

    if (!input || input.length < 3) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_INPUT",
            message: "Input must be at least 3 characters.",
          },
        },
        { status: 400 }
      );
    }

    const requestBody: Record<string, unknown> = {
      input,
      includedRegionCodes: ["us"],
      includedPrimaryTypes: ["street_address", "subpremise", "premise"],
    };

    if (sessionToken) {
      requestBody.sessionToken = sessionToken;
    }

    const response = await fetch(AUTOCOMPLETE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": GOOGLE_PLACES_API_KEY,
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    if (!response.ok) {
      const message =
        data?.error?.message ?? "Autocomplete request failed";
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "AUTOCOMPLETE_ERROR",
            message,
          },
        },
        { status: response.status >= 400 ? response.status : 500 }
      );
    }

    const suggestions: AutocompletePrediction[] = [];
    const rawSuggestions = data?.suggestions ?? [];

    for (const item of rawSuggestions) {
      const pred = item?.placePrediction;
      if (!pred?.placeId) continue;

      const mainText =
        pred?.structuredFormat?.mainText?.text ?? pred?.text?.text ?? "";
      const secondaryText =
        pred?.structuredFormat?.secondaryText?.text ?? "";
      const types = Array.isArray(pred?.types) ? pred.types : [];

      suggestions.push({
        placeId: pred.placeId,
        mainText,
        secondaryText,
        types,
      });
    }

    return NextResponse.json({
      success: true,
      suggestions,
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "An unexpected error occurred";
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message,
        },
      },
      { status: 500 }
    );
  }
}
