import type { Metadata } from "next";
import { Suspense } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { EstimateSavingsPage } from "@/components/sections/estimate-savings/estimate-savings-page";

export const metadata: Metadata = {
  title: "Estimate Your Property Tax Savings",
  description:
    "Enter your property address to instantly compare your tax assessment to market value. See how much you could save by appealing your property taxes.",
  alternates: { canonical: "/estimate" },
};

export default function EstimatePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Suspense fallback={<div className="container mx-auto max-w-7xl px-4 py-16 md:py-24 animate-pulse bg-slate-100/50 rounded-sm min-h-[400px]" />}>
          <EstimateSavingsPage />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
