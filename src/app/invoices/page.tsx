"use client";

import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { getCountry } from "@/lib/countries";
import { useAppData } from "@/lib/store";
import { computeInvoiceTotals, formatDate, formatMoney } from "@/lib/tax";

export default function InvoicesPage() {
  const data = useAppData();
  const business = data.business;
  const country = business ? getCountry(business.countryCode) : null;

  return (
    <AppShell
      title="Invoices"
      actions={
        <Link href="/invoices/new" className="btn btn-primary">
          New invoice
        </Link>
      }
    >
      {!business ? (
        <div className="panel max-w-lg">
          <p className="text-sm text-ink-muted">
            Complete business setup before creating invoices.
          </p>
          <Link href="/setup" className="btn btn-primary mt-4 inline-flex">
            Go to setup
          </Link>
        </div>
      ) : data.invoices.length === 0 ? (
        <p className="text-ink-muted">
          No invoices yet.{" "}
          <Link href="/invoices/new" className="text-teal underline">
            Create one
          </Link>
          .
        </p>
      ) : (
        <div className="overflow-x-auto border border-line rounded-lg bg-[#faf8f3]/80">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs uppercase tracking-wider text-ink-muted">
                <th className="px-4 py-3 font-semibold">Number</th>
                <th className="px-4 py-3 font-semibold">Client</th>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {data.invoices.map((inv) => {
                const total = computeInvoiceTotals(
                  inv.items,
                  country!,
                  inv.interstate ?? false
                ).grandTotal;
                return (
                  <tr
                    key={inv.id}
                    className="border-b border-line/70 last:border-0 hover:bg-teal-soft/30"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/invoices/${inv.id}`}
                        className="font-medium text-teal hover:underline"
                      >
                        {inv.number}
                      </Link>
                    </td>
                    <td className="px-4 py-3">{inv.client.name || "—"}</td>
                    <td className="px-4 py-3 tabular-nums">
                      {formatDate(inv.issueDate, country!.dateFormat)}
                    </td>
                    <td className="px-4 py-3 capitalize">{inv.status}</td>
                    <td className="px-4 py-3 text-right tabular-nums font-medium">
                      {formatMoney(total, country!.currency, country!.locale)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </AppShell>
  );
}
