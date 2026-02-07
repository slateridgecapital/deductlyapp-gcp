"use client";

import Link from "next/link";
import { TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <TrendingDown className="h-6 w-6 text-slate-900" />
          <span className="text-lg font-semibold text-slate-900">
            deductly
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="#methodology"
            className="text-sm text-slate-600 transition-colors hover:text-slate-900"
          >
            Methodology
          </a>
          <a
            href="#resources"
            className="text-sm text-slate-600 transition-colors hover:text-slate-900"
          >
            Resources
          </a>
        </nav>

        {/* CTA */}
        <Button className="bg-slate-900 text-white hover:bg-slate-800">
          Client Login
        </Button>
      </div>
    </header>
  );
}
