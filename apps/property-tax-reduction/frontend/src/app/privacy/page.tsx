// TODO: Replace "Slate Ridge Capital LLC" with actual legal entity name once formed
// TODO: Replace "contact@deductly.com" with actual contact email once established

import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how Deductly collects, uses, and protects your personal information when you use our property tax savings tools.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto max-w-3xl px-4 py-16 md:py-24">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-8">
            Privacy Policy
          </h1>
          <p className="text-sm text-slate-500 mb-8">
            <strong>Effective Date:</strong> March 10, 2026 &nbsp;|&nbsp;{" "}
            <strong>Last Updated:</strong> March 10, 2026
          </p>

          <p className="text-sm text-slate-500 leading-relaxed mb-4">
            Slate Ridge Capital LLC (&ldquo;Company,&rdquo; &ldquo;we,&rdquo;
            &ldquo;us,&rdquo; or &ldquo;our&rdquo;) operates the Deductly
            website (the &ldquo;Site&rdquo;) and related services (the
            &ldquo;Service&rdquo;). This Privacy Policy explains how we collect,
            use, and protect your information when you use the Service.
          </p>

          {/* 1. Information We Collect */}
          <h2 className="text-base font-semibold text-slate-900 mt-10 mb-4">
            1. Information We Collect
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed mb-4">
            <strong>Information you provide.</strong> If you submit the lead
            capture form on the Site, we collect your name, email address, zip
            code, and property address.
          </p>
          <p className="text-sm text-slate-500 leading-relaxed mb-4">
            <strong>Information collected automatically.</strong> When you use
            the Service, we automatically collect:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-sm text-slate-500 mb-4">
            <li>
              Property addresses you enter into the estimator tool, which are
              processed using the Google Places API to identify your property
            </li>
            <li>
              Usage data and analytics information through Google Analytics,
              including pages visited, interactions with the Service, browser
              type, and device information
            </li>
            <li>
              Cookies placed by Google Analytics (such as <code>_ga</code> and{" "}
              <code>_gid</code>) to distinguish unique users and sessions
            </li>
          </ul>
          <p className="text-sm text-slate-500 leading-relaxed mb-4">
            <strong>Information from third parties.</strong> We retrieve property
            tax and valuation data from publicly available records and
            third-party data sources to provide you with savings estimates.
          </p>

          {/* 2. How We Use Your Information */}
          <h2 className="text-base font-semibold text-slate-900 mt-10 mb-4">
            2. How We Use Your Information
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed mb-4">
            We use the information we collect to:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-sm text-slate-500 mb-4">
            <li>Provide, operate, and improve the Service</li>
            <li>
              Generate property tax savings estimates based on your property
              address
            </li>
            <li>
              Respond to your inquiries and communicate with you about your
              request if you submit the lead form
            </li>
            <li>
              Analyze usage trends and monitor the performance of the Service
            </li>
            <li>Comply with legal obligations</li>
          </ul>

          {/* 3. Third-Party Services */}
          <h2 className="text-base font-semibold text-slate-900 mt-10 mb-4">
            3. Third-Party Services
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed mb-4">
            The Service integrates with the following third-party services,
            each governed by their own privacy policies:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-sm text-slate-500 mb-4">
            <li>
              <strong>Google Places API</strong> &mdash; used for address
              autocomplete and property identification (
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-900 underline underline-offset-4 hover:opacity-80"
              >
                Google Privacy Policy
              </a>
              )
            </li>
            <li>
              <strong>Google Analytics</strong> &mdash; used to collect
              anonymized usage data and improve the Service (
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-900 underline underline-offset-4 hover:opacity-80"
              >
                Google Privacy Policy
              </a>
              )
            </li>
          </ul>
          <p className="text-sm text-slate-500 leading-relaxed mb-4">
            We are not responsible for the privacy practices of any third-party
            services. We encourage you to review their respective privacy
            policies.
          </p>
          <p className="text-sm text-slate-500 leading-relaxed mb-4">
            The Service is not directed to children under the age of 13, and we
            do not knowingly collect personal information from children. If you
            believe we have inadvertently collected information from a child,
            please contact us so we can promptly delete it.
          </p>

          {/* 4. Data Storage and Retention */}
          <h2 className="text-base font-semibold text-slate-900 mt-10 mb-4">
            4. Data Storage and Retention
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed mb-4">
            Your information is stored on Google Cloud Platform infrastructure
            located in the United States. We implement reasonable technical and
            organizational measures to protect your data, though no method of
            electronic storage is 100% secure.
          </p>
          <ul className="list-disc pl-6 space-y-2 text-sm text-slate-500 mb-4">
            <li>
              Property data retrieved for estimates is cached for up to 30 days,
              then automatically deleted
            </li>
            <li>
              Lead form submissions are retained until you request deletion
            </li>
            <li>
              Analytics data is retained in accordance with Google
              Analytics&apos; standard retention policies
            </li>
          </ul>

          {/* 5. Your Choices */}
          <h2 className="text-base font-semibold text-slate-900 mt-10 mb-4">
            5. Your Choices
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed mb-4">
            You have the following choices regarding your information:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-sm text-slate-500 mb-4">
            <li>
              <strong>Access and deletion.</strong> You may request access to or
              deletion of your personal information by emailing us at the
              address below
            </li>
            <li>
              <strong>Email opt-out.</strong> If you submitted the lead form,
              you may opt out of future communications by following the
              unsubscribe instructions in any email or by contacting us
            </li>
            <li>
              <strong>Cookies.</strong> You can disable cookies through your
              browser settings. Note that disabling cookies may affect the
              functionality of certain analytics features
            </li>
          </ul>

          {/* 6. Contact */}
          <h2 className="text-base font-semibold text-slate-900 mt-10 mb-4">
            6. Contact
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed mb-4">
            If you have any questions about this Privacy Policy or wish to
            exercise your rights, please contact us at:
          </p>
          <p className="text-sm text-slate-500 leading-relaxed mb-4">
            Slate Ridge Capital LLC
            <br />
            Email:{" "}
            <a
              href="mailto:contact@deductly.com"
              className="text-slate-900 underline underline-offset-4 hover:opacity-80"
            >
              contact@deductly.com
            </a>
          </p>
          <p className="text-sm text-slate-500 leading-relaxed mb-4">
            We may update this Privacy Policy from time to time. When we do, we
            will revise the &ldquo;Last Updated&rdquo; date at the top of this
            page. We encourage you to review this policy periodically.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
