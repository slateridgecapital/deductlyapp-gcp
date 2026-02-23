"use client";

import { useState } from "react";
import { ChevronDown, ListChecks, Loader2, CheckCircle2, ClipboardCheck } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ZIP_REGEX = /^\d{5}$/;

interface DiyAppealGuideSectionProps {
  assessedValue: number;
  marketValue: number;
  taxRatePercent: number;
  estimatedSavings: number;
}

const STEPS = [
  {
    id: 1,
    title: "Pull Your Assessment Notice",
    generic:
      "From your county assessor's portal or mailed notice, collect your assessed market value, taxable value, assessment date, parcel number, and grievance filing deadline. Miss the deadline and you're locked out for the year.",
    sfExample:
      "In San Francisco County, the Assessor-Recorder mails assessment notices in July. You have until September 15 to file an appeal with the Assessment Appeals Board.",
  },
  {
    id: 2,
    title: "Understand Your County's Tax Methodology",
    generic:
      "Research how your county derives your assessment — equalization rate or assessment ratio, full market value vs. percentage-based, exemptions already applied, and active abatements or phase-ins.",
    sfExample:
      "California uses Proposition 13, which caps assessed value at the purchase price plus a maximum 2% annual increase — not current market value. San Francisco's base tax rate is approximately 1.18% of assessed value. Your appeal argues the current assessed value exceeds actual market value, even under Prop 13 rules.",
  },
  {
    id: 3,
    title: "Research Comparable Sales",
    generic:
      "This is the most time-consuming step. Gather 5–10 recent sales matching your property on location, square footage, lot size, year built, property class, bedroom/bathroom count, and condition. Document sale price, date, address, and full property details. Disqualify foreclosures, estate sales, and related-party transfers.",
    sfExample:
      "In San Francisco, neighborhood-level differences matter significantly. A comp in Noe Valley won't support an appeal for a property in the Outer Sunset. Use DataSF, the SF Assessor's property information map, or MLS sold data filtered to your specific neighborhood.",
  },
  {
    id: 4,
    title: "Build an Adjustment Grid",
    generic:
      "Raw comps are never apples-to-apples. For each comparable, create line-item dollar adjustments for every difference — square footage, finished units, lot size, location quality, market conditions at time of sale. Professional appraisers use standardized adjustment tables. You'll need to research or estimate these yourself.",
    sfExample:
      "A comp in SF with a legal ADU (accessory dwelling unit) or in-law unit adds substantial value. If your property doesn't have one, you'd need to adjust that comp's sale price down — but determining by how much requires local market knowledge of ADU premiums in your specific neighborhood.",
  },
  {
    id: 5,
    title: "Document Property-Specific Issues",
    generic:
      "Photograph and gather third-party evidence for anything that reduces your property's value — structural damage, outdated systems, environmental factors, needed repairs. Get written contractor estimates where possible.",
    sfExample:
      "San Francisco properties commonly face foundation issues (especially in the Marina and Sunset districts), seismic retrofit requirements, lead paint, or rent-controlled tenants that limit income potential. Each can materially reduce market value — but you need documentation, not just claims.",
  },
  {
    id: 6,
    title: "Prepare Your Appeal Application",
    generic:
      "Obtain the correct form from your county. Complete it with your opinion of market value and basis for complaint. Attach your full evidence packet — comps spreadsheet, adjustment grid, photos, estimates, and narrative summary. Errors or omissions can get your appeal dismissed without review.",
    sfExample:
      "San Francisco requires filing an Assessment Appeal Application (form AAB-1) with the Clerk of the Board of Supervisors. You must specify whether you're disputing the assessed value, exemption denial, or calamity reassessment. The form asks for your opinion of value — this number becomes your legal claim and cannot be raised later.",
  },
  {
    id: 7,
    title: "File Before the Deadline",
    generic:
      "Submit with all attachments by your county's hard deadline. Get proof of submission. Confirm whether multiple copies are required. There is no grace period.",
    sfExample:
      "San Francisco's regular filing period closes September 15. If you miss it, there is a late filing period through November 30 — but only if you can demonstrate good cause. Most applicants should not rely on this.",
  },
  {
    id: 8,
    title: "Prepare for Your Hearing",
    generic:
      "You'll present before your county's review board. You typically get 10–15 minutes. Organize evidence by strength, anticipate the assessor's counterarguments, bring extra copies for board members. The board hears dozens of cases per day and will ask pointed questions.",
    sfExample:
      "San Francisco's Assessment Appeals Board schedules hearings at City Hall. Wait times from filing to hearing can be 6–18 months. You'll present opposite a representative from the Assessor's office who may bring their own comps and adjustments to counter yours.",
  },
  {
    id: 9,
    title: "Present Your Case",
    generic:
      "State your property, the current assessed value, and your opinion of value. Walk through comps and adjustments. Highlight property issues. Summarize your requested reduction. Answer questions directly — present evidence, don't argue.",
    sfExample: null,
  },
  {
    id: 10,
    title: "Evaluate the Decision",
    generic:
      "The board issues a revised value or denial. If denied or insufficient, your options vary by jurisdiction — some allow further administrative appeals, others require filing in court with additional legal costs and time.",
    sfExample:
      "In San Francisco, the Assessment Appeals Board decision is final at the administrative level. If you disagree, your next step is a lawsuit filed in San Francisco Superior Court — which involves attorney fees, court costs, and a significantly longer timeline.",
  },
];

interface LetUsTakeItFormProps {
  name: string;
  setName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  zipCode: string;
  setZipCode: (v: string) => void;
  error: string | null;
  setError: (v: string | null) => void;
  isSubmitting: boolean;
  setIsSubmitting: (v: boolean) => void;
  isSuccess: boolean;
  setIsSuccess: (v: boolean) => void;
  assessedValue: number;
  marketValue: number;
  taxRatePercent: number;
  estimatedSavings: number;
  idSuffix: string;
}

function LetUsTakeItForm({
  name,
  setName,
  email,
  setEmail,
  zipCode,
  setZipCode,
  error,
  setError,
  isSubmitting,
  setIsSubmitting,
  isSuccess,
  setIsSuccess,
  assessedValue,
  marketValue,
  taxRatePercent,
  estimatedSavings,
  idSuffix,
}: LetUsTakeItFormProps) {
  return (
    <div className="rounded-sm border border-slate-200 bg-white p-6 lg:sticky lg:top-20">
      <div>
        <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
          <ClipboardCheck className="h-4 w-4" />
          Let Us Take it From Here
        </h3>
        <p className="mt-1 text-sm text-slate-600">
          We will handle the entire process, no obligation, no pressure.
        </p>
      </div>

      {isSuccess ? (
        <div className="mt-5 flex items-start gap-3 rounded-sm border border-emerald-200 bg-emerald-50 p-4">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
          <div>
            <p className="font-medium text-emerald-900">
              We&apos;ve got your info.
            </p>
            <p className="mt-1 text-sm text-emerald-700">
              We&apos;ll reach out shortly with a personalized plan. No
              filings or commitments until you&apos;re ready.
            </p>
          </div>
        </div>
      ) : (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setError(null);

            const trimmedZip = zipCode.trim();
            const trimmedName = name.trim();
            const trimmedEmail = email.trim();

            if (!ZIP_REGEX.test(trimmedZip)) {
              setError("Please enter a valid 5-digit zip code.");
              return;
            }
            if (!trimmedName) {
              setError("Please enter your name.");
              return;
            }
            if (!EMAIL_REGEX.test(trimmedEmail)) {
              setError("Please enter a valid email address.");
              return;
            }

            setIsSubmitting(true);
            try {
              const res = await fetch("/api/submit-request", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  address: trimmedZip,
                  name: trimmedName,
                  email: trimmedEmail,
                  assessedValue,
                  marketValue,
                  taxRatePercent,
                  estimatedSavings,
                }),
              });

              const json = await res.json();
              if (!res.ok) {
                setError(
                  json?.error?.message ??
                    "Something went wrong. Please try again."
                );
                setIsSubmitting(false);
                return;
              }

              setIsSuccess(true);
            } catch {
              setError("Something went wrong. Please try again.");
              setIsSubmitting(false);
            }
          }}
          className="mt-5 space-y-4"
        >
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor={`diy-name${idSuffix}`} className="text-sm">
                Full Name
              </Label>
              <Input
                id={`diy-name${idSuffix}`}
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError(null);
                }}
                placeholder="Your full name"
                required
                className="h-10"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor={`diy-email${idSuffix}`} className="text-sm">
                Email
              </Label>
              <Input
                id={`diy-email${idSuffix}`}
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
                placeholder="you@gmail.com"
                required
                className="h-10"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor={`diy-zip${idSuffix}`} className="text-sm">
                Zip Code
              </Label>
              <Input
                id={`diy-zip${idSuffix}`}
                type="text"
                inputMode="numeric"
                maxLength={5}
                value={zipCode}
                onChange={(e) => {
                  setZipCode(e.target.value.replace(/\D/g, ""));
                  setError(null);
                }}
                placeholder="94105"
                required
                className="h-10"
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <div className="space-y-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-12 w-full text-base cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <ClipboardCheck className="mr-2 h-4 w-4" />
                  Get a personalized plan
                </>
              )}
            </Button>
            <p className="text-center text-xs text-slate-500">
              No upfront cost. No obligation.
            </p>
          </div>
        </form>
      )}
    </div>
  );
}

export function DiyAppealGuideSection({
  assessedValue,
  marketValue,
  taxRatePercent,
  estimatedSavings,
}: DiyAppealGuideSectionProps) {
  const [zipCode, setZipCode] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  return (
    <section className="mb-8">
      <Card className="gap-3 bg-slate-50/80 shadow-sm rounded-sm border-slate-200">
        <div className="lg:flex">
          <div className="flex flex-col gap-3 lg:flex-1 lg:min-w-0">
            <CardHeader className="gap-1">
              <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
                <ListChecks className="h-4 w-4" />
                Next Steps: The Appeal Process
              </span>
            </CardHeader>
            <CardContent className="space-y-0">
              <div className="divide-y divide-slate-200">
                {STEPS.map((step) => (
                  <details key={step.id} className="group" open={step.id === 1}>
                    <summary className="flex cursor-pointer list-none items-center gap-3 py-2 text-sm [&::-webkit-details-marker]:hidden">
                      <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-700">
                        {step.id}
                      </span>
                      <span className="flex-1 font-medium text-slate-800">
                        {step.title}
                      </span>
                      <ChevronDown className="h-4 w-4 shrink-0 text-slate-500 transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="pb-4">
                      <p className="text-sm text-slate-600">{step.generic}</p>
                      {step.sfExample && (
                        <div className="mt-3 rounded bg-slate-100 p-3">
                          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Example
                          </p>
                          <p className="text-sm text-slate-700">
                            {step.sfExample}
                          </p>
                        </div>
                      )}
                    </div>
                  </details>
                ))}
              </div>
            </CardContent>
          </div>

          <div className="hidden px-6 lg:block lg:w-[440px] lg:shrink-0 lg:border-l lg:border-slate-200 lg:py-0">
            <LetUsTakeItForm
              name={name}
              setName={setName}
              email={email}
              setEmail={setEmail}
              zipCode={zipCode}
              setZipCode={setZipCode}
              error={error}
              setError={setError}
              isSubmitting={isSubmitting}
              setIsSubmitting={setIsSubmitting}
              isSuccess={isSuccess}
              setIsSuccess={setIsSuccess}
              assessedValue={assessedValue}
              marketValue={marketValue}
              taxRatePercent={taxRatePercent}
              estimatedSavings={estimatedSavings}
              idSuffix="-lg"
            />
          </div>
        </div>
      </Card>

      <div id="let-us-take-it-form" className="mt-6 lg:hidden">
        <LetUsTakeItForm
          name={name}
          setName={setName}
          email={email}
          setEmail={setEmail}
          zipCode={zipCode}
          setZipCode={setZipCode}
          error={error}
          setError={setError}
          isSubmitting={isSubmitting}
          setIsSubmitting={setIsSubmitting}
          isSuccess={isSuccess}
          setIsSuccess={setIsSuccess}
          assessedValue={assessedValue}
          marketValue={marketValue}
          taxRatePercent={taxRatePercent}
          estimatedSavings={estimatedSavings}
          idSuffix=""
        />
      </div>
    </section>
  );
}
