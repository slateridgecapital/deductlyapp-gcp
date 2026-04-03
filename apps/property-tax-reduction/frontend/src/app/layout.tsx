import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://deductly.com"),
  title: {
    default: "Free Property Tax Savings Calculator | Deductly",
    template: "%s | Deductly",
  },
  description:
    "Are you overpaying property taxes? Compare your tax assessment to current market value in 30 seconds and estimate how much you could save on your property tax bill.",
  openGraph: {
    type: "website",
    siteName: "Deductly",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-GWSD2NMQ3L"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-GWSD2NMQ3L');
          `}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  name: "Deductly",
                  url: "https://deductly.com",
                  email: "contact@deductly.com",
                  description:
                    "Deductly helps homeowners identify property tax overpayments and estimate potential savings by comparing assessments to current market values.",
                },
                {
                  "@type": "WebApplication",
                  name: "Deductly Property Tax Savings Calculator",
                  url: "https://deductly.com/estimate",
                  applicationCategory: "FinanceApplication",
                  operatingSystem: "All",
                  offers: {
                    "@type": "Offer",
                    price: "0",
                    priceCurrency: "USD",
                  },
                  description:
                    "Free tool that compares your property tax assessment to current market value and estimates how much you could save by appealing.",
                },
              ],
            }),
          }}
        />
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
