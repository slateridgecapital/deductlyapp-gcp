export function AboutSection() {
  return (
    <section id="about" className="bg-slate-50 px-4 py-16 md:py-24">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center">
          <h2 className="mb-6 text-3xl font-bold text-slate-900 md:text-4xl">
            About Deductly
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-slate-600">
            Powerful tax strategies shouldn&apos;t be reserved for those who
            can afford an expensive tax advisor. Deductly is changing that,
            starting with property taxes. Most homeowners are quietly
            overpaying. Instant estimates, transparent math, and a clear path
            to recovering what you&apos;re owed.
          </p>
          <p className="text-sm text-slate-500">
            Reach us at{" "}
            <a
              href="mailto:contact@deductly.com"
              className="text-slate-700 underline underline-offset-4 hover:text-slate-900"
            >
              contact@deductly.com
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
