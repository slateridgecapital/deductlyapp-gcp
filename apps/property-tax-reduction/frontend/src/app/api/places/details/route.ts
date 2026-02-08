import { NextRequest, NextResponse } from "next/server";

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const PLACES_BASE_URL = "https://places.googleapis.com/v1/places";

/**
 * Build a clean address from Google Places address components
 * Excludes building/establishment names, only includes street-level components
 * Format: "123 Main St, City, State ZIP"
 */
function buildCleanAddress(addressComponents: any[]): string {
  const components: Record<string, string> = {};
  
  // Extract relevant components
  for (const component of addressComponents) {
    const types = component.types || [];
    const longText = component.longText || "";
    const shortText = component.shortText || "";
    
    if (types.includes("street_number")) {
      components.streetNumber = longText;
    } else if (types.includes("route")) {
      components.route = longText;
    } else if (types.includes("locality")) {
      components.city = longText;
    } else if (types.includes("administrative_area_level_1")) {
      components.state = shortText; // Use short form (e.g., "CA" not "California")
    } else if (types.includes("postal_code")) {
      components.zipCode = longText;
    }
  }
  
  // Build address parts (street, city, state+zip)
  const parts: string[] = [];
  
  // Street address
  if (components.streetNumber && components.route) {
    parts.push(`${components.streetNumber} ${components.route}`);
  } else if (components.route) {
    parts.push(components.route);
  }
  
  // City
  if (components.city) {
    parts.push(components.city);
  }
  
  // State and ZIP
  if (components.state && components.zipCode) {
    parts.push(`${components.state} ${components.zipCode}`);
  } else if (components.state) {
    parts.push(components.state);
  } else if (components.zipCode) {
    parts.push(components.zipCode);
  }
  
  return parts.join(", ");
}

export interface PlaceDetailsResult {
  formattedAddress: string;
  needsUnit: boolean;
  cleanAddress?: string; // Address without building name, suitable for Zillow
}

export async function POST(request: NextRequest) {
  try {
    if (!GOOGLE_PLACES_API_KEY) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "SERVICE_UNAVAILABLE",
            message: "Place details service is not configured.",
          },
        },
        { status: 503 }
      );
    }

    const body = await request.json();
    const placeId =
      typeof body?.placeId === "string" ? body.placeId.trim() : "";
    const sessionToken =
      typeof body?.sessionToken === "string" ? body.sessionToken : undefined;

    if (!placeId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_INPUT",
            message: "placeId is required.",
          },
        },
        { status: 400 }
      );
    }

    const url = new URL(`${PLACES_BASE_URL}/${placeId}`);
    if (sessionToken) {
      url.searchParams.set("sessionToken", sessionToken);
    }

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "X-Goog-Api-Key": GOOGLE_PLACES_API_KEY,
        "X-Goog-FieldMask": "formattedAddress,addressComponents,types",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      const message =
        data?.error?.message ?? "Place details request failed";
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "DETAILS_ERROR",
            message,
          },
        },
        { status: response.status >= 400 ? response.status : 500 }
      );
    }

    const formattedAddress =
      data?.formattedAddress ?? "";
    const addressComponents = data?.addressComponents ?? [];
    const types: string[] = Array.isArray(data?.types) ? data.types : [];

    // Build clean address (without building name) for Zillow API
    const cleanAddress = buildCleanAddress(addressComponents);

    // Check if address already has a subpremise (unit) component
    const hasSubpremise = addressComponents.some(
      (c: { types?: string[] }) =>
        Array.isArray(c?.types) && c.types.includes("subpremise")
    );

    // Multi-unit indicators: premise without subpremise, or address text hints
    const multiUnitTypes = ["premise", "subpremise", "establishment"];
    const hasMultiUnitType = types.some((t: string) =>
      multiUnitTypes.includes(t)
    );
    const addressLower = formattedAddress.toLowerCase();
    const hasAptKeywords =
      /\b(apt|apartment|unit|suite|ste|#|condo|condominium)\b/i.test(
        addressLower
      );

    // needsUnit: true if we detected a multi-unit building but no subpremise
    const needsUnit =
      !hasSubpremise &&
      (hasMultiUnitType || hasAptKeywords);

    return NextResponse.json({
      success: true,
      data: {
        formattedAddress,
        needsUnit,
        cleanAddress, // Clean address for Zillow API
      } satisfies PlaceDetailsResult,
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
