"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

type FaqItem = {
  id: string;
  question: string;
  answer: ReactNode;
};

const faqs: FaqItem[] = [
  {
    id: "faq-coverage",
    question: "What does the $59 cover?",
    answer: (
      <>
        <p className="mb-3">
          Your flat annual fee covers everything Deductly does for you:
        </p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            A property tax assessment document prepared for you to submit to
            your county.
          </li>
          <li>
            A review of missed tax exemptions and credits you may qualify for.
          </li>
          <li>
            Lower rate checks on your homeowner&apos;s insurance, utilities,
            and PMI.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "faq-no-savings",
    question: "What counts as \u201Cno savings\u201D?",
    answer: (
      <p>
        If the property tax assessment you submit comes back without a
        reduction, you qualify for a full refund.
      </p>
    ),
  },
  {
    id: "faq-appeal",
    question: "Do you file the appeal for me?",
    answer: (
      <p>
        No. Deductly prepares the assessment document and supporting materials.
        You submit directly to your county, which keeps you in control and
        keeps the fee low.
      </p>
    ),
  },
  {
    id: "faq-flat-fee",
    question: "Why a flat fee instead of a percentage?",
    answer: (
      <p>
        Because <em>every</em> dollar saved should be yours. Flat pricing
        aligns our incentive with yours &mdash; we want you to save as much as
        possible, not for us to take a cut.
      </p>
    ),
  },
  {
    id: "faq-refund",
    question: "How do I get my refund if there are no savings?",
    answer: (
      <p>
        Email{" "}
        <a
          href="mailto:contact@deductly.com"
          className="text-slate-900 underline underline-offset-4 hover:opacity-80"
        >
          contact@deductly.com
        </a>{" "}
        with your assessment outcome and we&rsquo;ll process a full refund.
      </p>
    ),
  },
];

export function PricingFaqSection() {
  const [openId, setOpenId] = useState<string | null>(faqs[0].id);

  return (
    <section id="faq" className="bg-white px-4 py-16 md:py-24">
      <div className="container mx-auto max-w-3xl">
        <div className="mb-10 text-center">
          <h2 className="mb-4 text-3xl font-bold text-slate-900 md:text-4xl">
            Frequently asked questions
          </h2>
          <p className="text-lg text-slate-600">
            Straight answers. No fine print.
          </p>
        </div>

        <div className="divide-y divide-slate-200 border-y border-slate-200">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            const panelId = `${faq.id}-panel`;
            return (
              <div key={faq.id} id={faq.id} className="scroll-mt-24">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left text-base font-semibold text-slate-900 transition-colors hover:text-slate-700 md:text-lg"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-slate-500 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={faq.id}
                  className={`grid transition-[grid-template-rows] duration-200 ease-out ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="pb-5 pr-8 text-base leading-relaxed text-slate-600">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
