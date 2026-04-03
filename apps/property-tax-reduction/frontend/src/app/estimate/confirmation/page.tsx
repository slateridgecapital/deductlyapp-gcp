import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ConfirmationContent } from "./confirmation-content";

export const metadata: Metadata = {
  title: "Request Submitted",
  robots: { index: false, follow: false },
};

export default function ConfirmationPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <ConfirmationContent />
      </main>
      <Footer />
    </div>
  );
}
