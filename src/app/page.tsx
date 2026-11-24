import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <span className="font-[family-name:var(--font-display)] text-xl font-semibold tracking-tight text-ink">
          BillFora
        </span>
        <nav className="flex items-center gap-2">
          <Link href="/login" className="btn btn-ghost hidden sm:inline-flex">
            Sign in
          </Link>
          <Link href="/signup" className="btn btn-secondary">
            Create account
          </Link>
        </nav>
      </header>

      <main className="relative flex-1">
        <section className="relative mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-10 px-4 pb-16 pt-6 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div className="relative z-10 animate-[fadeUp_0.7s_ease_both]">
            <p className="font-[family-name:var(--font-display)] text-5xl leading-[0.95] tracking-tight text-ink sm:text-6xl lg:text-7xl">
              BillFora
            </p>
            <h1 className="mt-5 max-w-lg text-xl leading-snug text-ink sm:text-2xl">
              Invoices that match your country’s tax rules, currency, and date
              format.
            </h1>
            <p className="mt-4 max-w-md text-base text-ink-muted leading-relaxed">
              Choose India, the US, Germany, or another supported country when
              you set up. The app applies that country’s labels (GSTIN, VAT,
              EIN), tax split where needed, and footer note.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/signup" className="btn btn-primary">
                Create free account
              </Link>
              <Link href="/login" className="btn btn-secondary">
                Sign in
              </Link>
            </div>
          </div>

          <div
            className="relative animate-[fadeUp_0.9s_ease_0.12s_both] min-h-[280px] sm:min-h-[360px] lg:min-h-[420px] rounded-sm overflow-hidden border border-line"
            aria-hidden
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(145deg, #0f5c4c 0%, #1a4a3f 38%, #2a241c 72%, #1c1914 100%)",
              }}
            />
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 20% 30%, rgba(243,239,230,0.25), transparent 45%), radial-gradient(circle at 80% 70%, rgba(216,235,229,0.2), transparent 40%)",
              }}
            />
            <div className="absolute inset-6 sm:inset-8 flex flex-col justify-between text-[#f3efe6]">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[0.65rem] uppercase tracking-[0.2em] opacity-70">
                    Tax Invoice
                  </p>
                  <p className="mt-1 font-[family-name:var(--font-display)] text-2xl sm:text-3xl">
                    INV-0042
                  </p>
                </div>
                <p className="text-sm opacity-80">₹ · GSTIN</p>
              </div>
              <div className="space-y-2 text-sm opacity-90">
                <div className="flex justify-between border-b border-white/20 pb-2">
                  <span>Consulting, Apr</span>
                  <span>₹45,000</span>
                </div>
                <div className="flex justify-between border-b border-white/20 pb-2">
                  <span>CGST 9% + SGST 9%</span>
                  <span>₹8,100</span>
                </div>
                <div className="flex justify-between font-semibold pt-1">
                  <span>Total due</span>
                  <span>₹53,100</span>
                </div>
              </div>
              <p className="text-[0.7rem] leading-relaxed opacity-60 max-w-xs">
                Sample India GST invoice. Use Print in the browser to save a
                PDF.
              </p>
            </div>
          </div>
        </section>

        <section className="border-t border-line bg-paper-deep/40">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <h2 className="page-title max-w-md">
              Set your country once. Invoices follow that pack.
            </h2>
            <p className="mt-3 max-w-lg text-ink-muted">
              Your business profile and invoices sit on your BillFora account,
              so the same login works on the web app (desktop builds come
              later). Change country and the title, tax ID label, currency, and
              legal note update together.
            </p>
            <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <li className="animate-[fadeUp_0.6s_ease_both]">
                <p className="font-[family-name:var(--font-display)] text-lg font-semibold text-ink">
                  Country packs
                </p>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                  Fifteen packs today. India uses GSTIN and Tax Invoice; the US
                  uses EIN; Germany uses Rechnung and MwSt. Date order follows
                  the pack too.
                </p>
              </li>
              <li
                className="animate-[fadeUp_0.6s_ease_both]"
                style={{ animationDelay: "0.05s" }}
              >
                <p className="font-[family-name:var(--font-display)] text-lg font-semibold text-ink">
                  India GST split
                </p>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                  Same-state bills split tax into CGST and SGST. Tick interstate
                  and the form uses IGST instead.
                </p>
              </li>
              <li
                className="animate-[fadeUp_0.6s_ease_both]"
                style={{ animationDelay: "0.1s" }}
              >
                <p className="font-[family-name:var(--font-display)] text-lg font-semibold text-ink">
                  Print to PDF
                </p>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                  Open an invoice and use the browser print dialog. No extra
                  plugin.
                </p>
              </li>
            </ul>
          </div>
        </section>
      </main>

      <footer className="border-t border-line py-6 text-center text-sm text-ink-muted">
        BillFora · free plan includes 15 invoices per month
      </footer>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
