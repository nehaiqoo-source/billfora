import Link from "next/link";
import { CountryHero } from "@/components/landing/CountryHero";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f2f5f4] text-[#14201c]">
      <CountryHero />

      <main>
        <section id="how" className="border-t border-[#d5ddd9] bg-[#f2f5f4]">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <h2 className="font-[family-name:var(--font-display)] max-w-xl text-3xl leading-tight tracking-tight sm:text-4xl">
              Built for freelancers who bill across borders.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#4a5a54]">
              You sit in one country. Clients sit in others. BillFora keeps one
              account and swaps the invoice pack — GSTIN in India, EIN in the
              US, MwSt. in Germany — without rebuilding the bill each time.
            </p>

            <ol className="mt-14 grid gap-10 sm:grid-cols-3">
              <li>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2f9b84]">
                  01
                </p>
                <p className="mt-3 font-[family-name:var(--font-display)] text-xl font-semibold">
                  Pick your country pack
                </p>
                <p className="mt-2 text-sm leading-relaxed text-[#4a5a54]">
                  Setup once. Tax labels, currency, date order, and legal note
                  follow that pack on every new invoice.
                </p>
              </li>
              <li>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2f9b84]">
                  02
                </p>
                <p className="mt-3 font-[family-name:var(--font-display)] text-xl font-semibold">
                  Send a link, not only a PDF
                </p>
                <p className="mt-2 text-sm leading-relaxed text-[#4a5a54]">
                  Share a public invoice URL on WhatsApp or email. Clients open
                  it on any phone. You still print to PDF when you need a file.
                </p>
              </li>
              <li>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2f9b84]">
                  03
                </p>
                <p className="mt-3 font-[family-name:var(--font-display)] text-xl font-semibold">
                  Same login on phone
                </p>
                <p className="mt-2 text-sm leading-relaxed text-[#4a5a54]">
                  Draft fast on mobile (client + amount). Finish details on the
                  web when you have a desk.
                </p>
              </li>
            </ol>
          </div>
        </section>

        <section className="border-t border-[#d5ddd9] bg-[#0b1412] text-[#eef3f1]">
          <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-16 sm:px-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-white">
                BillFora
              </p>
              <p className="mt-2 max-w-md text-sm text-[#eef3f1]/65">
                Free plan includes 15 invoices a month. Paid plans unlock more
                when Razorpay is live.
              </p>
            </div>
            <Link
              href="/signup"
              className="rounded-md bg-[#2f9b84] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#278a75]"
            >
              Create free account
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#d5ddd9] bg-[#f2f5f4] py-6 text-center text-sm text-[#4a5a54]">
        BillFora · country-aware invoices for people who sell everywhere
      </footer>
    </div>
  );
}
