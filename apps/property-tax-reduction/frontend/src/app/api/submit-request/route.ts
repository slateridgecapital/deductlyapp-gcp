import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getDb } from "@/lib/firebase-admin";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const address =
      typeof body?.address === "string" ? body.address.trim() : "";
    const unitNumber =
      typeof body?.unitNumber === "string" ? body.unitNumber.trim() : "";
    const zipCode =
      typeof body?.zipCode === "string" ? body.zipCode.trim() : "";
    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const email = typeof body?.email === "string" ? body.email.trim() : "";
    const assessedValue =
      typeof body?.assessedValue === "number" ? body.assessedValue : 0;
    const marketValue =
      typeof body?.marketValue === "number" ? body.marketValue : 0;
    const taxRatePercent =
      typeof body?.taxRatePercent === "number" ? body.taxRatePercent : 0;
    const estimatedSavings =
      typeof body?.estimatedSavings === "number" ? body.estimatedSavings : 0;

    if (!address) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "INVALID_INPUT", message: "Address is required" },
        },
        { status: 400 }
      );
    }
    if (!name) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "INVALID_INPUT", message: "Name is required" },
        },
        { status: 400 }
      );
    }
    if (!email) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "INVALID_INPUT", message: "Email is required" },
        },
        { status: 400 }
      );
    }
    if (!validateEmail(email)) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "INVALID_INPUT", message: "Please enter a valid email address" },
        },
        { status: 400 }
      );
    }

    const assessedTaxBill = assessedValue * (taxRatePercent / 100);
    const marketTaxBill = marketValue * (taxRatePercent / 100);
    const source = request.headers.get("referer") ?? "";

    const db = getDb();
    const normalizedEmail = email.toLowerCase();
    const now = new Date();
    const docId = `${now.toISOString().replace(/\.\d{3}Z$/, "")}_${normalizedEmail}`;
    await db.collection("lead_submissions").doc(docId).set({
      name,
      email: normalizedEmail,
      zipCode,
      address,
      unitNumber,
      assessedValue,
      marketValue,
      taxRatePercent,
      assessedTaxBill,
      marketTaxBill,
      estimatedSavings,
      submittedAt: FieldValue.serverTimestamp(),
      leadStatus: "new",
      source,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to save lead submission:", err);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to submit your request. Please try again.",
        },
      },
      { status: 500 }
    );
  }
}
