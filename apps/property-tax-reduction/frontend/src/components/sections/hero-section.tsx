"use client";

import Link from "next/link";
import { Search, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useEffect, useRef } from "react";

export function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Ensure video plays and set playback speed
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.65; // 65% speed
      videoRef.current.play().catch((error) => {
        console.log("Video autoplay failed:", error);
      });
    }
  }, []);

  return (
    <section className="relative overflow-hidden px-4 py-16 md:py-24">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="h-full w-full object-cover opacity-40"
          style={{
            transform: 'scale(1.1) translateZ(0)',
            animation: 'slowPan 6000s ease infinite alternate',
            willChange: 'transform',
            backfaceVisibility: 'hidden',
            perspective: 1000,
          }}
          onLoadedData={() => console.log("Video loaded successfully")}
          onError={(e) => console.error("Video error:", e)}
        >
          <source src="/videos/hero-bg.mp4" type="video/mp4" />
        </video>
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50/40 to-white/50" />
      </div>

      <div className="container relative z-10 mx-auto max-w-4xl text-center">
        {/* Headline */}
        <h1 className="mb-6 font-serif text-4xl leading-tight tracking-[-1px] text-slate-900 md:text-5xl lg:text-6xl">
          Home prices fell.
          <br />
          <em>Your</em> property taxes didn&apos;t.
        </h1>

        {/* Subheadline */}
        <p className="mx-auto mb-10 max-w-2xl text-lg text-slate-600">
          Within seconds, we compare your tax assessment to today&apos;s market to see if you could lower your taxes.
        </p>

        {/* Property Search Card */}
        <Card className="mx-auto max-w-[500px] shadow-lg rounded-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-slate-600" />
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-700">
                Property Search
              </span>
            </div>
            <Badge
              variant="secondary"
              className="bg-emerald-50 text-emerald-700"
            >
              <CheckCircle className="mr-1 h-3 w-3" />
              Saved $100k+ in taxes so far
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="text"
              placeholder="Enter address..."
              className="h-12 text-base"
            />
            <Button className="h-12 w-full bg-slate-900 text-base font-medium hover:bg-slate-800">
              Estimate Savings
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <p className="text-xs text-slate-500">
              Or enter values{" "}
              <Link href="/estimate" className="underline hover:text-slate-700">
                manually
              </Link>{" "}
              to estimate savings
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
