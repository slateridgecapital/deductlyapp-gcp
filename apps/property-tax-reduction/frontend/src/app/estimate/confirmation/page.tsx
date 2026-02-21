import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";

export default function ConfirmationPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto max-w-2xl px-4 py-16 md:py-24">
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 className="h-10 w-10 text-emerald-600" />
            </div>
            <h1 className="mb-3 text-2xl font-bold text-slate-900 md:text-3xl">
              Request received
            </h1>
            <p className="mb-8 text-slate-600">
              Thanks for submitting your assessment request. We&apos;ll review your
              property details and reach out within 1-2 business days.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button asChild variant="default">
                <Link href="/estimate">Back to estimate</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/">Return home</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
