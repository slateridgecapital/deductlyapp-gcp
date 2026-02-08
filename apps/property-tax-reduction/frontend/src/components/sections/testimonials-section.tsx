"use client";

import { Quote, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

const testimonials = [
  {
    quote:
      "I had no idea I was overpaying until I used this tool. The process was simple and I saved over $2,000 on my annual taxes.",
    name: "Sarah M.",
    location: "Austin, TX",
    savings: "$2,340",
  },
  {
    quote:
      "Within minutes I found out my assessment was $150K higher than market value. Definitely worth checking.",
    name: "Michael R.",
    location: "Phoenix, AZ",
    savings: "$1,875",
  },
  {
    quote:
      "Easy to use and the county-specific guidance was exactly what I needed to understand my options.",
    name: "Jennifer L.",
    location: "Denver, CO",
    savings: "$3,120",
  },
  {
    quote:
      "I was skeptical at first, but the savings were real. My property tax bill dropped by almost $200 a month.",
    name: "David K.",
    location: "Miami, FL",
    savings: "$2,280",
  },
  {
    quote:
      "The whole process took less than 10 minutes. I wish I had done this years ago.",
    name: "Amanda T.",
    location: "Seattle, WA",
    savings: "$1,650",
  },
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="bg-white px-4 py-16 md:py-24">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-slate-900 md:text-4xl">
            Testimonials
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-600">
            Real results from homeowners who checked their property tax
            assessments.
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="mx-auto max-w-5xl px-12">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {testimonials.map((testimonial, index) => (
                <CarouselItem
                  key={index}
                  className="pl-4 md:basis-1/2 lg:basis-1/3"
                >
                  <Card className="h-full border-slate-200 transition-shadow hover:shadow-lg">
                    <CardContent className="flex h-full flex-col p-4">
                      {/* Quote Icon */}
                      <Quote className="mb-2 h-6 w-6 text-slate-300" />

                      {/* Quote Text */}
                      <p className="mb-4 flex-1 text-sm text-slate-600 leading-relaxed">
                        &ldquo;{testimonial.quote}&rdquo;
                      </p>

                      {/* Author Info */}
                      <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {testimonial.name}
                          </p>
                          <p className="flex items-center gap-1 text-xs text-slate-500">
                            <MapPin className="h-3 w-3" />
                            {testimonial.location}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-slate-500">Saved</p>
                          <p className="text-sm font-bold text-emerald-600">
                            {testimonial.savings}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    </section>
  );
}
