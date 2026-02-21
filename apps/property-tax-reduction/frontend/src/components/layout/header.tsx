"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TrendingDown } from "lucide-react";
export function Header() {
  const pathname = usePathname();

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    if (pathname === "/") {
      e.preventDefault();
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 relative">
        {/* Logo */}
        <Link 
          href="/" 
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
          onClick={handleLogoClick}
        >
          <TrendingDown className="h-6 w-6 text-slate-900" />
          <span className="text-lg font-semibold text-slate-900">
            deductly
          </span>
        </Link>

        {/* Navigation - Centered */}
        <nav className="hidden items-center gap-8 md:flex absolute left-1/2 -translate-x-1/2">
          <a
            href="/"
            className="text-sm text-slate-600 transition-colors hover:text-slate-900"
            onClick={handleHomeClick}
          >
            Home
          </a>
          <a
            href="/#how-it-works"
            className="text-sm text-slate-600 transition-colors hover:text-slate-900"
            onClick={(e) => handleSmoothScroll(e, "how-it-works")}
          >
            How This Works
          </a>
          <a
            href="/#testimonials"
            className="text-sm text-slate-600 transition-colors hover:text-slate-900"
            onClick={(e) => handleSmoothScroll(e, "testimonials")}
          >
            Testimonials
          </a>
          <a
            href="/#about"
            className="text-sm text-slate-600 transition-colors hover:text-slate-900"
            onClick={(e) => handleSmoothScroll(e, "about")}
          >
            About
          </a>
        </nav>

      </div>
    </header>
  );
}
