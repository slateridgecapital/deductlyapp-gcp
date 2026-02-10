import { NextRequest, NextResponse } from "next/server";

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const PLACES_BASE_URL = "https://places.googleapis.com/v1/places";
const ADDRESS_VALIDATION_URL =
  "https://addressvalidation.googleapis.com/v1:validateAddress";

export interface PlaceDetailsResult {
  formattedAddress: string;
  needsUnit: boolean;
  cleanAddress?: string; // Address without building name, suitable for Zillow
}

type AddressComponentLike = {
  componentType?: string;
  componentName?: { text?: string };
  component_type?: string;
  component_name?: { text?: string };
};

/**
 * Build a clean address from Address Validation API address components.
 * Format: "123 Main St, City, State ZIP"
 * Handles both camelCase and snake_case (REST JSON can vary).
 */
function buildCleanAddressFromComponents(
  addressComponents: AddressComponentLike[]
): string {
  const components: Record<string, string> = {};

  for (const component of addressComponents ?? []) {
    const type =
      component.componentType ??
      (component as { component_type?: string }).component_type ??
      "";
    const name = component.componentName ?? (component as { component_name?: { text?: string } }).component_name;
    const text = name?.text ?? "";

    if (type === "street_number") {
      components.streetNumber = text;
    } else if (type === "route") {
      components.route = text;
    } else if (type === "locality") {
      components.city = text;
    } else if (type === "administrative_area_level_1") {
      components.state = text;
    } else if (type === "postal_code") {
      components.zipCode = text;
    }
  }

  const parts: string[] = [];
  if (components.streetNumber && components.route) {
    parts.push(`${components.streetNumber} ${components.route}`);
  } else if (components.route) {
    parts.push(components.route);
  }
  if (components.city) {
    parts.push(components.city);
  }
  if (components.state && components.zipCode) {
    parts.push(`${components.state} ${components.zipCode}`);
  } else if (components.state) {
    parts.push(components.state);
  } else if (components.zipCode) {
    parts.push(components.zipCode);
  }

  return parts.join(", ");
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

    // Step 1: Get formatted address from Places API (minimal fields)
    const placesUrl = new URL(`${PLACES_BASE_URL}/${placeId}`);
    if (sessionToken) {
      placesUrl.searchParams.set("sessionToken", sessionToken);
    }

    const placesResponse = await fetch(placesUrl.toString(), {
      method: "GET",
      headers: {
        "X-Goog-Api-Key": GOOGLE_PLACES_API_KEY,
        "X-Goog-FieldMask": "formattedAddress",
      },
    });

    const placesData = await placesResponse.json();

    if (!placesResponse.ok) {
      const message =
        placesData?.error?.message ?? "Place details request failed";
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "DETAILS_ERROR",
            message,
          },
        },
        { status: placesResponse.status >= 400 ? placesResponse.status : 500 }
      );
    }

    const formattedAddress =
      typeof placesData?.formattedAddress === "string"
        ? placesData.formattedAddress
        : "";

    if (!formattedAddress) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "DETAILS_ERROR",
            message: "No address returned for place.",
          },
        },
        { status: 502 }
      );
    }

    // Step 2: Validate address with Address Validation API to get needsUnit
    const validationBody = {
      address: {
        regionCode: "US",
        addressLines: [formattedAddress],
      },
      ...(sessionToken && { sessionToken }),
    };

    const validationResponse = await fetch(
      `${ADDRESS_VALIDATION_URL}?key=${GOOGLE_PLACES_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validationBody),
      }
    );

    const validationData = await validationResponse.json();

    if (!validationResponse.ok) {
      const message =
        validationData?.error?.message ?? "Address validation request failed";
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message,
          },
        },
        {
          status:
            validationResponse.status >= 400 ? validationResponse.status : 500,
        }
      );
    }

    const result = validationData?.result;
    const verdict = result?.verdict;
    const address = result?.address;

    const needsUnit =
      verdict?.possibleNextAction === "CONFIRM_ADD_SUBPREMISES";

    const validatedFormatted =
      address?.formattedAddress ?? formattedAddress;
    const addressComponents =
      address?.addressComponents ?? (address as { address_components?: AddressComponentLike[] })?.address_components ?? [];
    const cleanAddress =
      addressComponents.length > 0
        ? buildCleanAddressFromComponents(addressComponents)
        : formattedAddress;

    return NextResponse.json({
      success: true,
      data: {
        formattedAddress: validatedFormatted,
        needsUnit,
        cleanAddress: cleanAddress || validatedFormatted,
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
