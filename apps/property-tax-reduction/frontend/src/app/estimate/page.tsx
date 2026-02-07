import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { EstimateSavingsPage } from "@/components/sections/estimate-savings/estimate-savings-page";

export default function EstimatePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <EstimateSavingsPage />
      </main>
      <Footer />
    </div>
  );
}
