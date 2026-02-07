import { MapPin, LineChart, Calculator, ClipboardCheck } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";


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

export function ProcessSection() {
  return (
    <section className="bg-white px-4 py-16 md:py-24">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-slate-900 md:text-4xl">
            How this works
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-600">
            A quick check that compares your county&apos;s assessed value to today&apos;s market value, then estimates what a reassessment could mean for your tax bill.
          </p>
        </div>

        {/* Process Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((step) => (
            <Card
              key={step.number}
              className="border-slate-200 transition-shadow hover:shadow-lg"
            >
              <CardHeader className="pb-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100">
                  <step.icon className="h-6 w-6 text-slate-700" />
                </div>
              </CardHeader>
              <CardContent>
                <h3 className="mb-2 text-lg font-semibold text-slate-900">
                  {step.number}. {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-600">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
