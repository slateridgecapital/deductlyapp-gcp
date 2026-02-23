import { TrendingDown } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="bg-black text-slate-300">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-white" />
            <span className="text-base font-semibold text-white">
              deductly
            </span>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-6">
            <a
              href="#privacy"
              className="text-sm text-primary-foreground transition-colors hover:opacity-90"
            >
              Privacy Policy
            </a>
            <a
              href="#terms"
              className="text-sm text-primary-foreground transition-colors hover:opacity-90"
            >
              Terms of Use
            </a>
            <a
              href="#about"
              className="text-sm text-primary-foreground transition-colors hover:opacity-90"
            >
              About
            </a>
          </nav>

          {/* Disclaimer */}
          <p className="max-w-xs text-right text-xs text-primary-foreground">
            © 2026 deductly.
          </p>
        </div>
      </div>
    </footer>
  );
}
