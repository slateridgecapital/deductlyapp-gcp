import { NextRequest, NextResponse } from "next/server";
import { GoogleAuth } from "google-auth-library";

const CALCULATOR_URL =
  process.env.CALCULATOR_URL ?? "http://localhost:8080";
const isLocalhost =
  CALCULATOR_URL.startsWith("http://localhost") ||
  CALCULATOR_URL.startsWith("http://127.0.0.1");

// --- Cached Google Auth token (valid ~1 hour, refresh 5 min early) ---
let cachedToken: string | null = null;
let tokenExpiresAt = 0;
const TOKEN_REFRESH_BUFFER_MS = 5 * 60 * 1000; // refresh 5 min before expiry
let authInstance: GoogleAuth | null = null;

function getAuthInstance(): GoogleAuth {
  // GoogleAuth is safe to reuse — it caches credentials internally
  if (!authInstance) {
    authInstance = new GoogleAuth();
  }
  return authInstance;
}

async function getIdToken(audience: string): Promise<string> {
  const now = Date.now();
  if (cachedToken && now < tokenExpiresAt - TOKEN_REFRESH_BUFFER_MS) {
    return cachedToken;
  }

  const auth = getAuthInstance();
  const client = await auth.getIdTokenClient(audience);
  const token = await client.idTokenProvider.fetchIdToken(audience);

  // ID tokens from Google are valid for 1 hour (3600s)
  cachedToken = token;
  tokenExpiresAt = now + 3600 * 1000;

  return token;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const address = typeof body?.address === "string" ? body.address.trim() : "";

    if (!address) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_INPUT",
            message: "Address is required",
            details: "Please provide a valid property address",
          },
        },
        { status: 400 }
      );
    }

    const baseUrl = CALCULATOR_URL.replace(/\/$/, "");
    const targetUrl = `${baseUrl}/calculate`;

    let response: Response;

    if (isLocalhost) {
      response = await fetch(targetUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      });
    } else {
      const token = await getIdToken(baseUrl);
      response = await fetch(targetUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ address }),
      });
    }

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
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
