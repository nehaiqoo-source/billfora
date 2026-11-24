"use client";

import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { getCountry } from "@/lib/countries";
import { useAppData } from "@/lib/store";
import { formatMoney, computeInvoiceTotals } from "@/lib/tax";

export default function DashboardPage() {
  const data = useAppData();
  const business = data.business;
  const invoices = data.invoices;

  const paid = invoices.filter((i) => i.status === "paid");
  const open = invoices.filter((i) => i.status !== "paid");

  let outstanding = 0;
  let paidTotal = 0;
  if (business) {
    const country = getCountry(business.countryCode);
    for (const inv of open) {
      outstanding += computeInvoiceTotals(
        inv.items,
        country,
        inv.interstate ?? false
      ).grandTotal;
    }
    for (const inv of paid) {
      paidTotal += computeInvoiceTotals(
        inv.items,
        country,
        inv.interstate ?? false
      ).grandTotal;
    }
  }

  const money = (n: number) => {
    if (!business) return String(n);
    const c = getCountry(business.countryCode);
    return formatMoney(n, c.currency, c.locale);
  };

  return (
    <AppShell
      title="Dashboard"
      actions={
        <>
          <Link href="/invoices/new" className="btn btn-primary">
            New invoice
          </Link>
          {!business ? (
            <Link href="/setup" className="btn btn-secondary">
              Complete setup
            </Link>
          ) : null}
        </>
      }
    >
      {!business ? (
        <div className="panel max-w-lg">
          <p className="font-[family-name:var(--font-display)] text-xl font-semibold">
            Set up your business first
          </p>
          <p className="mt-2 text-sm text-ink-muted">
            Choose your country so invoices get the right tax labels, currency,
            and legal note.
          </p>
          <Link href="/setup" className="btn btn-primary mt-5 inline-flex">
            Go to setup
          </Link>
        </div>
      ) : (
        <>
          <p className="mb-6 text-ink-muted">
            {business.name}
            <span className="mx-2 text-line">·</span>
            {getCountry(business.countryCode).name}
            <span className="mx-2 text-line">·</span>
            {getCountry(business.countryCode).currency}
          </p>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="panel">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                Invoices
              </p>
              <p className="mt-2 font-[family-name:var(--font-display)] text-3xl font-semibold tabular-nums">
                {invoices.length}
              </p>
            </div>
            <div className="panel">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                Outstanding
              </p>
              <p className="mt-2 font-[family-name:var(--font-display)] text-3xl font-semibold tabular-nums text-teal">
                {money(outstanding)}
              </p>
            </div>
            <div className="panel">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                Paid
              </p>
              <p className="mt-2 font-[family-name:var(--font-display)] text-3xl font-semibold tabular-nums">
                {money(paidTotal)}
              </p>
            </div>
          </div>

          <section className="mt-10">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold">
                Recent invoices
              </h2>
              <Link
                href="/invoices"
                className="text-sm font-medium text-teal hover:underline"
              >
                View all
              </Link>
            </div>
            {invoices.length === 0 ? (
              <p className="text-sm text-ink-muted">
                No invoices yet.{" "}
                <Link href="/invoices/new" className="text-teal underline">
                  Create your first
                </Link>
                .
              </p>
            ) : (
              <ul className="divide-y divide-line border border-line rounded-lg overflow-hidden bg-[#faf8f3]/80">
                {invoices.slice(0, 5).map((inv) => {
                  const total = computeInvoiceTotals(
                    inv.items,
                    getCountry(business.countryCode),
                    inv.interstate ?? false
                  ).grandTotal;
                  return (
                    <li key={inv.id}>
                      <Link
                        href={`/invoices/${inv.id}`}
                        className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-teal-soft/40 transition-colors"
                      >
                        <div>
                          <p className="font-medium">{inv.number}</p>
                          <p className="text-sm text-ink-muted">
                            {inv.client.name || "No client"} · {inv.status}
                          </p>
                        </div>
                        <p className="tabular-nums font-medium">{money(total)}</p>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </>
      )}
    </AppShell>
  );
}
