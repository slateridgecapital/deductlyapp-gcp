// TODO: Replace "Slate Ridge Capital LLC" with actual legal entity name once formed
// TODO: Replace "contact@deductly.com" with actual contact email once established

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function TermsOfUsePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto max-w-3xl px-4 py-16 md:py-24">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-8">
            Terms of Use
          </h1>
          <p className="text-sm text-slate-500 mb-8">
            <strong>Effective Date:</strong> March 10, 2026 &nbsp;|&nbsp;{" "}
            <strong>Last Updated:</strong> March 10, 2026
          </p>

          {/* 1. Acceptance of Terms */}
          <h2 className="text-base font-semibold text-slate-900 mt-10 mb-4">
            1. Acceptance of Terms
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed mb-4">
            Welcome to Deductly. By accessing or using the Deductly website
            (the &ldquo;Site&rdquo;) and any services, tools, or content made
            available through the Site (collectively, the
            &ldquo;Service&rdquo;), you agree to be bound by these Terms of Use
            (the &ldquo;Terms&rdquo;). If you do not agree to these Terms, you
            must not access or use the Service.
          </p>
          <p className="text-sm text-slate-500 leading-relaxed mb-4">
            These Terms constitute a legally binding agreement between you and
            Slate Ridge Capital LLC (&ldquo;Company,&rdquo; &ldquo;we,&rdquo;
            &ldquo;us,&rdquo; or &ldquo;our&rdquo;). Please read them
            carefully.
          </p>

          {/* 2. Description of Service */}
          <h2 className="text-base font-semibold text-slate-900 mt-10 mb-4">
            2. Description of Service
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed mb-4">
            Deductly is a free, web-based tool that helps homeowners estimate
            potential property tax savings. The Service includes:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-sm text-slate-500 mb-4">
            <li>
              A property tax savings estimator that fetches assessed value,
              market value, and tax rate data based on a property address you
              provide
            </li>
            <li>
              Estimated calculations of potential annual tax savings if your
              property were reassessed
            </li>
            <li>
              A 10-step do-it-yourself (DIY) appeal guide with general
              information about filing property tax appeals
            </li>
            <li>
              A lead capture form that allows you to request professional
              assistance with your property tax appeal
            </li>
          </ul>
          <p className="text-sm text-slate-500 leading-relaxed mb-4">
            The Service is currently provided at no cost. We reserve the right
            to introduce paid features or modify the Service at any time.
          </p>

          {/* 3. Eligibility */}
          <h2 className="text-base font-semibold text-slate-900 mt-10 mb-4">3. Eligibility</h2>
          <p className="text-sm text-slate-500 leading-relaxed mb-4">
            You must be at least 18 years of age and a resident of the United
            States to use the Service. By using the Service, you represent and
            warrant that you meet these eligibility requirements.
          </p>

          {/* 4. No Professional Advice Disclaimer */}
          <h2 className="text-base font-semibold text-slate-900 mt-10 mb-4">
            4. No Professional Advice
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed mb-4">
            <strong>
              The Service does not provide legal, tax, financial, or
              professional advice of any kind.
            </strong>{" "}
            All information, estimates, calculations, and content provided
            through the Service are for general informational and educational
            purposes only.
          </p>
          <p className="text-sm text-slate-500 leading-relaxed mb-4">
            The DIY appeal guide included in the Service provides general
            information about the property tax appeal process. It may not
            reflect current local rules, deadlines, or procedural requirements
            in your jurisdiction.
          </p>
          <p className="text-sm text-slate-500 leading-relaxed mb-4">
            You should consult a qualified tax professional, attorney, or
            licensed appraiser before making any decisions regarding your
            property taxes, including whether to file an appeal. Reliance on
            any information provided by the Service is solely at your own risk.
          </p>

          {/* 5. Accuracy Disclaimer */}
          <h2 className="text-base font-semibold text-slate-900 mt-10 mb-4">
            5. Accuracy of Information
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed mb-4">
            The property valuations, tax rates, and savings estimates provided
            by the Service are approximations only. They are derived from
            third-party data sources, including public records and services
            such as Zillow, and are not guaranteed to be accurate, complete, or
            current.
          </p>
          <p className="text-sm text-slate-500 leading-relaxed mb-4">
            We make no representations or warranties regarding the accuracy,
            reliability, or completeness of any data, estimates, or
            calculations provided through the Service. Actual property tax
            savings, if any, will depend on many factors outside our control,
            including local assessment practices, appeal outcomes, and changes
            in tax law.
          </p>
          <p className="text-sm text-slate-500 leading-relaxed mb-4">
            Any testimonials, case studies, or example savings figures
            displayed on the Site represent past results and are not guarantees
            of future performance. Individual results will vary.
          </p>

          {/* 6. User Responsibilities */}
          <h2 className="text-base font-semibold text-slate-900 mt-10 mb-4">
            6. User Responsibilities
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed mb-4">
            You are solely responsible for:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-sm text-slate-500 mb-4">
            <li>
              Verifying the accuracy of all data, estimates, and information
              provided by the Service before relying on it
            </li>
            <li>
              Making your own independent decisions regarding your property
              taxes and any appeal filings
            </li>
            <li>
              Providing accurate and truthful information when using the
              Service, including when submitting the lead capture form
            </li>
            <li>
              Complying with all applicable local, state, and federal laws and
              regulations
            </li>
          </ul>

          {/* 7. Data Collection & Privacy */}
          <h2 className="text-base font-semibold text-slate-900 mt-10 mb-4">
            7. Data Collection and Privacy
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed mb-4">
            When you use the Service, we may collect and process the following
            information:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-sm text-slate-500 mb-4">
            <li>
              <strong>Property addresses</strong> you enter, which are
              processed using the Google Places Autocomplete API to identify
              your property
            </li>
            <li>
              <strong>Property tax and valuation data</strong> sourced from
              publicly available records through third-party services,
              including Zillow
            </li>
            <li>
              <strong>Lead form submissions</strong> including your name, email
              address, and zip code, which are stored in our database
            </li>
            <li>
              <strong>Standard web analytics data</strong> and cookies used to
              improve the Service
            </li>
          </ul>
          <p className="text-sm text-slate-500 leading-relaxed mb-4">
            Your use of the Service is also governed by our Privacy Policy,
            which describes how we collect, use, and protect your information
            in greater detail. By using the Service, you consent to the
            collection and use of your information as described in these Terms
            and our Privacy Policy.
          </p>

          {/* 8. Lead Form Submissions */}
          <h2 className="text-base font-semibold text-slate-900 mt-10 mb-4">
            8. Lead Form Submissions
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed mb-4">
            If you submit the lead capture form on the Site, you provide us
            with your name, email address, and zip code. By submitting this
            form, you consent to being contacted by us or our partners via
            email regarding your property tax appeal and related services.
          </p>
          <p className="text-sm text-slate-500 leading-relaxed mb-4">
            You may opt out of future communications at any time by following
            the unsubscribe instructions in any email you receive from us or
            by contacting us at the address provided in Section 19.
          </p>

          {/* 9. Intellectual Property */}
          <h2 className="text-base font-semibold text-slate-900 mt-10 mb-4">
            9. Intellectual Property
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed mb-4">
            All content, features, functionality, design, text, graphics,
            logos, icons, and branding displayed on the Site are the exclusive
            property of Slate Ridge Capital LLC or its licensors and are
            protected by United States and international copyright, trademark,
            and other intellectual property laws.
          </p>
          <p className="text-sm text-slate-500 leading-relaxed mb-4">
            You may not reproduce, distribute, modify, create derivative works
            of, publicly display, or otherwise use any content from the Site
            without our prior written consent, except as expressly permitted
            by these Terms.
          </p>

          {/* 10. Prohibited Uses */}
          <h2 className="text-base font-semibold text-slate-900 mt-10 mb-4">
            10. Prohibited Uses
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed mb-4">
            You agree not to use the Service to:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-sm text-slate-500 mb-4">
            <li>
              Scrape, crawl, or use automated tools to extract data from the
              Site
            </li>
            <li>
              Access the Service through automated means, bots, or scripts
            </li>
            <li>
              Reverse engineer, decompile, or disassemble any part of the
              Service
            </li>
            <li>
              Misrepresent your identity or affiliation with any person or
              entity
            </li>
            <li>
              Use the Service for any unlawful purpose or in violation of any
              applicable law
            </li>
            <li>
              Interfere with or disrupt the integrity or performance of the
              Service
            </li>
            <li>
              Attempt to gain unauthorized access to any part of the Service
              or its related systems
            </li>
          </ul>

          {/* 11. Third-Party Links & Services */}
          <h2 className="text-base font-semibold text-slate-900 mt-10 mb-4">
            11. Third-Party Links and Services
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed mb-4">
            The Service may contain links to third-party websites or integrate
            with third-party services, including Google Places API and Zillow.
            These third-party services are governed by their own terms of use
            and privacy policies.
          </p>
          <p className="text-sm text-slate-500 leading-relaxed mb-4">
            We are not responsible for the content, accuracy, availability, or
            practices of any third-party services. Your interactions with
            third-party services are solely between you and the applicable
            third party. Inclusion of any link or integration does not imply
            our endorsement of the third-party service.
          </p>

          {/* 12. Limitation of Liability */}
          <h2 className="text-base font-semibold text-slate-900 mt-10 mb-4">
            12. Limitation of Liability
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed mb-4">
            TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, SLATE RIDGE
            CAPITAL LLC AND ITS OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, AND
            AFFILIATES SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
            SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT
            LIMITED TO LOSS OF PROFITS, DATA, OR GOODWILL, ARISING OUT OF OR
            IN CONNECTION WITH YOUR ACCESS TO OR USE OF (OR INABILITY TO USE)
            THE SERVICE.
          </p>
          <p className="text-sm text-slate-500 leading-relaxed mb-4">
            WITHOUT LIMITING THE FOREGOING, WE SHALL NOT BE LIABLE FOR ANY
            DECISIONS YOU MAKE, ACTIONS YOU TAKE, OR OUTCOMES YOU EXPERIENCE
            BASED ON ESTIMATES, CALCULATIONS, OR INFORMATION PROVIDED BY THE
            SERVICE, INCLUDING ANY PROPERTY TAX APPEAL FILINGS OR RELATED
            FINANCIAL DECISIONS.
          </p>
          <p className="text-sm text-slate-500 leading-relaxed mb-4">
            THE SERVICE IS PROVIDED ON AN &ldquo;AS IS&rdquo; AND &ldquo;AS
            AVAILABLE&rdquo; BASIS WITHOUT WARRANTIES OF ANY KIND, WHETHER
            EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES
            OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND
            NON-INFRINGEMENT.
          </p>

          {/* 13. Indemnification */}
          <h2 className="text-base font-semibold text-slate-900 mt-10 mb-4">
            13. Indemnification
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed mb-4">
            You agree to indemnify, defend, and hold harmless Slate Ridge
            Capital LLC and its officers, directors, employees, agents, and
            affiliates from and against any and all claims, liabilities,
            damages, losses, costs, and expenses (including reasonable
            attorneys&apos; fees) arising out of or related to: (a) your use
            of the Service; (b) your violation of these Terms; (c) your
            violation of any applicable law or regulation; or (d) any
            decisions or actions you take based on information provided by the
            Service.
          </p>

          {/* 14. Dispute Resolution */}
          <h2 className="text-base font-semibold text-slate-900 mt-10 mb-4">
            14. Dispute Resolution
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed mb-4">
            <strong>Mandatory Binding Arbitration.</strong> Any dispute, claim,
            or controversy arising out of or relating to these Terms or the
            Service (collectively, &ldquo;Disputes&rdquo;) shall be resolved
            exclusively through final and binding arbitration administered by
            the American Arbitration Association (&ldquo;AAA&rdquo;) under its
            then-current Commercial Arbitration Rules. The arbitration shall be
            conducted by a single arbitrator and shall take place in the State
            of Delaware.
          </p>
          <p className="text-sm text-slate-500 leading-relaxed mb-4">
            <strong>Class Action Waiver.</strong> YOU AGREE THAT ANY DISPUTE
            RESOLUTION PROCEEDINGS WILL BE CONDUCTED ONLY ON AN INDIVIDUAL
            BASIS AND NOT IN A CLASS, CONSOLIDATED, OR REPRESENTATIVE ACTION.
            YOU WAIVE ANY RIGHT TO PARTICIPATE IN A CLASS ACTION LAWSUIT OR
            CLASS-WIDE ARBITRATION.
          </p>
          <p className="text-sm text-slate-500 leading-relaxed mb-4">
            <strong>Governing Law.</strong> These Terms and any Disputes shall
            be governed by and construed in accordance with the laws of the
            State of Delaware, without regard to its conflict of law
            provisions.
          </p>
          <p className="text-sm text-slate-500 leading-relaxed mb-4">
            <strong>Exceptions.</strong> Notwithstanding the foregoing, either
            party may seek injunctive or equitable relief in any court of
            competent jurisdiction to prevent the actual or threatened
            infringement or misappropriation of intellectual property rights.
          </p>

          {/* 15. Modifications to Terms */}
          <h2 className="text-base font-semibold text-slate-900 mt-10 mb-4">
            15. Modifications to Terms
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed mb-4">
            We reserve the right to modify these Terms at any time at our sole
            discretion. When we make changes, we will update the &ldquo;Last
            Updated&rdquo; date at the top of this page. Your continued use of
            the Service after any modifications constitutes your acceptance of
            the revised Terms.
          </p>
          <p className="text-sm text-slate-500 leading-relaxed mb-4">
            We encourage you to review these Terms periodically to stay
            informed of any updates.
          </p>

          {/* 16. Termination */}
          <h2 className="text-base font-semibold text-slate-900 mt-10 mb-4">
            16. Termination
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed mb-4">
            We reserve the right to suspend or terminate your access to the
            Service at any time, for any reason, and without prior notice or
            liability. Upon termination, your right to use the Service will
            immediately cease.
          </p>
          <p className="text-sm text-slate-500 leading-relaxed mb-4">
            Sections 4, 5, 9, 12, 13, 14, 17, and 18 shall survive any
            termination of these Terms.
          </p>

          {/* 17. Severability */}
          <h2 className="text-base font-semibold text-slate-900 mt-10 mb-4">
            17. Severability
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed mb-4">
            If any provision of these Terms is held to be invalid, illegal, or
            unenforceable by a court of competent jurisdiction, such provision
            shall be modified to the minimum extent necessary to make it
            enforceable, and the remaining provisions shall continue in full
            force and effect.
          </p>

          {/* 18. Entire Agreement */}
          <h2 className="text-base font-semibold text-slate-900 mt-10 mb-4">
            18. Entire Agreement
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed mb-4">
            These Terms, together with our Privacy Policy, constitute the
            entire agreement between you and Slate Ridge Capital LLC regarding
            your use of the Service and supersede all prior or contemporaneous
            agreements, representations, warranties, and understandings,
            whether written or oral.
          </p>

          {/* 19. Contact Information */}
          <h2 className="text-base font-semibold text-slate-900 mt-10 mb-4">
            19. Contact Information
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed mb-4">
            If you have any questions about these Terms, please contact us at:
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
        </div>
      </main>
      <Footer />
    </div>
  );
}
