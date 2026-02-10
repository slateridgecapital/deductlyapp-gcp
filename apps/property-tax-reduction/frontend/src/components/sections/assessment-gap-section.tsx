import { TrendingDown, MapPin, LineChart, Calculator, ClipboardCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const processSteps = [
  {
    number: 1,
    icon: MapPin,
    title: "See assessed value",
    description:
      "We pull the assessed value your county is using to calculate your property taxes.",
  },
  {
    number: 2,
    icon: LineChart,
    title: "Compare to market",
    description:
      "We estimate your home's current market value using trusted pricing sources and recent comps.",
  },
  {
    number: 3,
    icon: Calculator,
    title: "Estimate savings",
    description:
      "If market value is lower, we estimate what a reduced assessment could mean for your annual tax bill.",
  },
  {
    number: 4,
    icon: ClipboardCheck,
    title: "Get county next steps",
    description:
      "We outline what reassessment looks like in your county and timelines to know.",
  },
];

export function AssessmentGapSection() {
  // Example values for visualization
  const countyAssessment = 1000000;
  const marketValue = 750000;
  const maxValue = countyAssessment; // Use county as 100%
  const marketPercent = (marketValue / maxValue) * 100;

  // Tax calculations
  const taxRatePercent = 1.88; // Austin, TX tax rate
  const taxRate = taxRatePercent / 100;
  const assessedTaxes = countyAssessment * taxRate;
  const marketTaxes = marketValue * taxRate;
  const estimatedSavings = assessedTaxes - marketTaxes;

  return (
    <section id="how-it-works" className="bg-slate-100 px-4 py-16 md:py-24">
      <div className="container mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Column - Content */}
          <div className="flex flex-col justify-center">
            {/* Badge */}
            <Badge className="mb-6 w-fit bg-slate-800 text-white hover:bg-slate-800">
              <TrendingDown className="mr-1.5 h-3 w-3" />
              Property Tax Savings Estimate
            </Badge>

            {/* Title */}
            <h2 className="mb-4 text-[30px] font-bold text-slate-900 lg:text-4xl">
              How This Works
            </h2>

            {/* Process Steps */}
            <div className="mb-8 space-y-2">
              {processSteps.map((step) => (
                <div key={step.number} className="flex items-stretch gap-3">
                  <div className="flex w-12 shrink-0 items-center justify-center rounded-md bg-white shadow-md">
                    <step.icon className="h-6 w-6 text-slate-700" />
                  </div>
                  <div>
                    <span className="text-base font-semibold text-slate-900">
                      {step.number}. {step.title}
                    </span>
                    <p className="text-sm leading-relaxed text-slate-500">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="flex gap-8">
              <div className="border-l-2 border-slate-300 pl-4">
                <p className="text-2xl font-bold text-slate-900">25%</p>
                <p className="text-sm text-slate-500">Market Correction</p>
              </div>
              <div className="border-l-2 border-emerald-500 pl-4">
                <p className="text-2xl font-bold text-emerald-600">
                  ${Math.round(estimatedSavings).toLocaleString('en-US')}
                </p>
                <p className="text-sm text-slate-500">
                  Estimated Annual Savings
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Comparison Card */}
          <div className="flex items-center">
            <Card className="w-full shadow-lg py-4 gap-4">
              <CardHeader>
                <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
                  <ClipboardCheck className="h-4 w-4" />
                  Valuation Comparison
                </span>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* County Assessment */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">
                      County Assessed Value
                    </span>
                    <span className="font-semibold text-slate-900">
                      ${countyAssessment.toLocaleString('en-US')}
                    </span>
                  </div>
                  <Progress value={100} className="h-3 bg-slate-200" />
                </div>

                {/* Market Value */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Estimated Market Value</span>
                    <span className="font-semibold text-slate-900">
                      ${marketValue.toLocaleString('en-US')}
                    </span>
                  </div>
                  <Progress
                    value={marketPercent}
                    className="h-3 bg-slate-200 [&>div]:bg-slate-900"
                  />
                </div>

                {/* Tax Breakdown */}
                <div className="border-t border-slate-200 pt-4 mt-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Taxes at Assessed Value</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 italic hidden lg:inline">
                        ${countyAssessment.toLocaleString('en-US')} × {taxRatePercent}% =
                      </span>
                      <span className="font-semibold text-slate-900">
                        ${Math.round(assessedTaxes).toLocaleString('en-US')} <span className="lg:hidden">/ yr</span><span className="hidden lg:inline">/ year</span>
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm">
                    <span className="text-slate-600">Taxes at Market Value</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 italic hidden lg:inline">
                        ${marketValue.toLocaleString('en-US')} × {taxRatePercent}% =
                      </span>
                      <span className="font-semibold text-slate-900">
                        ${Math.round(marketTaxes).toLocaleString('en-US')} <span className="lg:hidden">/ yr</span><span className="hidden lg:inline">/ year</span>
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="text-slate-600">Estimated Annual Savings</span>
                    <span className="font-semibold text-emerald-600">
                      ${Math.round(estimatedSavings).toLocaleString('en-US')} <span className="lg:hidden">/ yr</span><span className="hidden lg:inline">/ year</span>
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm">
                    <span className="text-slate-600">Estimated Savings Percentage</span>
                    <span className="font-semibold text-emerald-600">
                      {((estimatedSavings / assessedTaxes) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-3 italic">
                    Based on Austin, TX property tax rate ({taxRatePercent}%)
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
