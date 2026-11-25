"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getCountry, type CountryCode } from "@/lib/countries";
import { formatMoney } from "@/lib/tax";

const DEMO: {
  code: CountryCode;
  line: string;
  amount: number;
  taxNote: string;
}[] = [
  {
    code: "IN",
    line: "Product design, April",
    amount: 45000,
    taxNote: "CGST 9% + SGST 9%",
  },
  {
    code: "US",
    line: "Retainer — April",
    amount: 3200,
    taxNote: "Sales tax 0% (exempt)",
  },
  {
    code: "DE",
    line: "Beratung April",
    amount: 2800,
    taxNote: "MwSt. 19%",
  },
  {
    code: "AE",
    line: "Website build",
    amount: 8500,
    taxNote: "VAT 5%",
  },
  {
    code: "GB",
    line: "Strategy sprint",
    amount: 2400,
    taxNote: "VAT 20%",
  },
];

function taxAmount(code: CountryCode, amount: number) {
  const pack = getCountry(code);
  if (code === "US") return 0;
  return Math.round(amount * (pack.defaultTaxRate / 100) * 100) / 100;
}

export function CountryHero() {
  const [active, setActive] = useState(0);
  const demo = DEMO[active];
  const pack = useMemo(() => getCountry(demo.code), [demo.code]);
  const tax = taxAmount(demo.code, demo.amount);
  const total = demo.amount + tax;
  const money = (n: number) => formatMoney(n, pack.currency, pack.locale);

  useEffect(() => {
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % DEMO.length);
    }, 4200);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-[#0b1412] text-[#eef3f1]">
      <div
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 70% 20%, rgba(45,140,120,0.28), transparent 55%), radial-gradient(ellipse 50% 40% at 10% 80%, rgba(238,243,241,0.06), transparent 50%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <header className="relative z-20 mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <span className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight">
          BillFora
        </span>
        <nav className="flex items-center gap-2">
          <Link
            href="/login"
            className="hidden rounded-md px-3 py-2 text-sm font-medium text-[#eef3f1]/80 hover:text-white sm:inline-flex"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="rounded-md bg-[#eef3f1] px-3.5 py-2 text-sm font-semibold text-[#0b1412] transition hover:bg-white"
          >
            Create account
          </Link>
        </nav>
      </header>

      <div className="relative z-10 mx-auto grid max-w-6xl gap-10 px-4 pb-16 pt-8 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:gap-12 lg:pb-24 lg:pt-10">
        <div className="animate-[bfFade_0.8s_ease_both]">
          <p className="font-[family-name:var(--font-display)] text-[clamp(3.25rem,9vw,6.5rem)] leading-[0.9] tracking-tight text-white">
            BillFora
          </p>
          <p className="mt-6 max-w-md text-lg leading-snug text-[#eef3f1]/85 sm:text-xl">
            Invoice Indian, US, and EU clients from one login — each bill in
            their tax format and currency.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/signup"
              className="rounded-md bg-[#2f9b84] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#278a75]"
            >
              Start free
            </Link>
            <a
              href="#how"
              className="rounded-md border border-white/25 px-5 py-3 text-sm font-semibold text-[#eef3f1] transition hover:border-white/50"
            >
              See how it works
            </a>
          </div>
          <p className="mt-5 text-sm text-[#eef3f1]/55">
            Free: 15 invoices / month · Web, iOS, Android
          </p>
        </div>

        <div className="animate-[bfFade_1s_ease_0.1s_both]">
          <div className="mb-4 flex flex-wrap gap-2" role="tablist" aria-label="Country preview">
            {DEMO.map((d, i) => {
              const c = getCountry(d.code);
              const on = i === active;
              return (
                <button
                  key={d.code}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => setActive(i)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold tracking-wide transition ${
                    on
                      ? "bg-[#2f9b84] text-white"
                      : "bg-white/10 text-[#eef3f1]/75 hover:bg-white/15"
                  }`}
                >
                  {c.name}
                </button>
              );
            })}
          </div>

          <div
            key={demo.code}
            className="relative overflow-hidden rounded-sm border border-white/15 bg-[#13201c] shadow-[0_30px_80px_rgba(0,0,0,0.35)] animate-[bfSlide_0.45s_ease_both]"
          >
            <div className="flex items-start justify-between border-b border-white/10 px-5 py-4 sm:px-6">
              <div>
                <p className="text-[0.65rem] uppercase tracking-[0.22em] text-[#eef3f1]/55">
                  {pack.invoiceTitle}
                </p>
                <p className="mt-1 font-[family-name:var(--font-display)] text-2xl text-white sm:text-3xl">
                  {pack.numberPrefix}0042
                </p>
              </div>
              <div className="text-right text-sm text-[#eef3f1]/75">
                <p>{pack.currencySymbol}</p>
                <p className="mt-1 text-xs">{pack.taxIdLabel}</p>
              </div>
            </div>
            <div className="space-y-3 px-5 py-5 text-sm sm:px-6">
              <div className="flex justify-between gap-4 border-b border-white/10 pb-3">
                <span className="text-[#eef3f1]/85">{demo.line}</span>
                <span className="tabular-nums text-white">{money(demo.amount)}</span>
              </div>
              <div className="flex justify-between gap-4 border-b border-white/10 pb-3 text-[#eef3f1]/7">
                <span>{demo.taxNote}</span>
                <span className="tabular-nums">{money(tax)}</span>
              </div>
              <div className="flex justify-between gap-4 pt-1 text-base font-semibold text-white">
                <span>Total due</span>
                <span className="tabular-nums text-[#7ddec8]">{money(total)}</span>
              </div>
            </div>
            <p className="border-t border-white/10 px-5 py-3 text-[0.7rem] leading-relaxed text-[#eef3f1]/45 sm:px-6">
              Labels, currency, and tax ID follow the {pack.name} pack. Share a
              link or print to PDF.
            </p>
          </div>
        </div>
      </div>

    </section>
  );
}
