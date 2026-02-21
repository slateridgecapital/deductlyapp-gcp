import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const TO_EMAIL = "frank.li@slateridgecapital.com";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const address =
      typeof body?.address === "string" ? body.address.trim() : "";
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

    const gmailUser = process.env.GMAIL_USER;
    const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;

    if (!gmailUser || !gmailAppPassword) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INTERNAL_ERROR",
            message: "Email service is not configured. Please try again later.",
          },
        },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: gmailUser,
        pass: gmailAppPassword,
      },
    });

    const assessedTaxes = assessedValue * (taxRatePercent / 100);
    const marketTaxes = marketValue * (taxRatePercent / 100);

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; color: #334155; max-width: 600px; margin: 0 auto; padding: 24px;">
  <h2 style="color: #0f172a; margin-bottom: 24px;">New Assessment Request</h2>
  <p>A user has requested that you complete the assessment request to the county on their behalf.</p>

  <h3 style="color: #0f172a; margin-top: 24px; margin-bottom: 12px;">Property & Contact</h3>
  <table style="width: 100%; border-collapse: collapse;">
    <tr><td style="padding: 8px 0; font-weight: 600; width: 140px;">Address</td><td>${escapeHtml(address)}</td></tr>
    <tr><td style="padding: 8px 0; font-weight: 600;">Name</td><td>${escapeHtml(name)}</td></tr>
    <tr><td style="padding: 8px 0; font-weight: 600;">Email</td><td>${escapeHtml(email)}</td></tr>
  </table>

  <h3 style="color: #0f172a; margin-top: 24px; margin-bottom: 12px;">Savings Summary</h3>
  <table style="width: 100%; border-collapse: collapse;">
    <tr><td style="padding: 8px 0; font-weight: 600; width: 180px;">County Assessed Value</td><td>$${assessedValue.toLocaleString("en-US")}</td></tr>
    <tr><td style="padding: 8px 0; font-weight: 600;">Estimated Market Value</td><td>$${marketValue.toLocaleString("en-US")}</td></tr>
    <tr><td style="padding: 8px 0; font-weight: 600;">Tax Rate</td><td>${taxRatePercent}%</td></tr>
    <tr><td style="padding: 8px 0; font-weight: 600;">Taxes at Assessed Value</td><td>$${Math.round(assessedTaxes).toLocaleString("en-US")}/year</td></tr>
    <tr><td style="padding: 8px 0; font-weight: 600;">Taxes at Market Value</td><td>$${Math.round(marketTaxes).toLocaleString("en-US")}/year</td></tr>
    <tr><td style="padding: 8px 0; font-weight: 600;">Estimated Annual Savings</td><td style="color: #059669; font-weight: 600;">$${Math.round(estimatedSavings).toLocaleString("en-US")}/year</td></tr>
  </table>

  <p style="margin-top: 24px; font-size: 14px; color: #64748b;">Submitted via Deductly property tax estimate form.</p>
</body>
</html>
`;

    await transporter.sendMail({
      from: `"Deductly" <${gmailUser}>`,
      to: TO_EMAIL,
      replyTo: email,
      subject: `New Assessment Request - ${address}`,
      html,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "An unexpected error occurred";
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

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
