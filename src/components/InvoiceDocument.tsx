import { getCountry } from "@/lib/countries";
import {
  computeInvoiceTotals,
  formatDate,
  formatMoney,
  lineSubtotal,
} from "@/lib/tax";
import type { BusinessProfile, Invoice } from "@/lib/types";

function formatAddress(
  parts: {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country?: string;
  },
  order: ReturnType<typeof getCountry>["addressOrder"]
): string[] {
  const lines: string[] = [];
  if (parts.addressLine1) lines.push(parts.addressLine1);
  if (parts.addressLine2) lines.push(parts.addressLine2);

  let locality = "";
  switch (order) {
    case "street-zip-city":
      locality = [parts.postalCode, parts.city].filter(Boolean).join(" ");
      break;
    case "zip-city-street":
      locality = [parts.postalCode, parts.city].filter(Boolean).join(" ");
      break;
    case "street-city-prefecture-zip":
      locality = [parts.city, parts.state, parts.postalCode]
        .filter(Boolean)
        .join(" ");
      break;
    case "street-city-zip":
      locality = [parts.city, parts.postalCode].filter(Boolean).join(" ");
      break;
    case "street-city-state-zip":
    default:
      locality = [parts.city, parts.state, parts.postalCode]
        .filter(Boolean)
        .join(", ");
      break;
  }
  if (locality) lines.push(locality);
  if (parts.country) lines.push(parts.country);
  return lines;
}

export function InvoiceDocument({
  invoice,
  business,
}: {
  invoice: Invoice;
  business: BusinessProfile;
}) {
  const country = getCountry(business.countryCode);
  const totals = computeInvoiceTotals(
    invoice.items,
    country,
    invoice.interstate ?? false
  );
  const money = (n: number) =>
    formatMoney(n, country.currency, country.locale);

  const fromLines = formatAddress(business, country.addressOrder);
  const toLines = formatAddress(
    {
      ...invoice.client,
      country: invoice.client.country || undefined,
    },
    country.addressOrder
  );

  return (
    <article className="invoice-sheet mx-auto max-w-3xl bg-[#faf8f3] border border-line rounded-lg shadow-[0_8px_30px_rgba(28,25,20,0.06)] p-8 sm:p-10 print:shadow-none print:border-0">
      <header className="flex flex-col gap-6 sm:flex-row sm:justify-between sm:items-start border-b border-line pb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-teal mb-2">
            BillFora
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-semibold tracking-tight text-ink">
            {country.invoiceTitle}
          </h1>
          <p className="mt-2 text-sm text-ink-muted">
            {invoice.number}
            <span className="mx-2 text-line">·</span>
            <span className="capitalize">{invoice.status}</span>
          </p>
        </div>
        <div className="text-sm sm:text-right space-y-1">
          <p>
            <span className="text-ink-muted">Issue </span>
            {formatDate(invoice.issueDate, country.dateFormat)}
          </p>
          <p>
            <span className="text-ink-muted">Due </span>
            {formatDate(invoice.dueDate, country.dateFormat)}
          </p>
          <p className="text-ink-muted">{country.currency}</p>
        </div>
      </header>

      <div className="mt-8 grid gap-8 sm:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted mb-2">
            From
          </p>
          <p className="font-semibold text-ink">{business.name}</p>
          {fromLines.map((l) => (
            <p key={l} className="text-sm text-ink-muted">
              {l}
            </p>
          ))}
          {business.taxId ? (
            <p className="mt-2 text-sm">
              <span className="text-ink-muted">{country.taxIdLabel}: </span>
              {business.taxId}
            </p>
          ) : null}
          {business.email ? (
            <p className="text-sm text-ink-muted">{business.email}</p>
          ) : null}
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted mb-2">
            Bill to
          </p>
          <p className="font-semibold text-ink">{invoice.client.name}</p>
          {toLines.map((l) => (
            <p key={l} className="text-sm text-ink-muted">
              {l}
            </p>
          ))}
          {invoice.client.taxId ? (
            <p className="mt-2 text-sm">
              <span className="text-ink-muted">{country.taxIdLabel}: </span>
              {invoice.client.taxId}
            </p>
          ) : null}
          {invoice.client.email ? (
            <p className="text-sm text-ink-muted">{invoice.client.email}</p>
          ) : null}
        </div>
      </div>

      {country.gstSplit ? (
        <p className="mt-4 text-xs text-ink-muted">
          Supply type:{" "}
          {invoice.interstate
            ? "Interstate (IGST)"
            : "Intra-state (CGST + SGST)"}
        </p>
      ) : null}

      <div className="mt-8 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-ink text-left text-xs uppercase tracking-wider text-ink-muted">
              <th className="py-2 pr-3 font-semibold">Description</th>
              {country.showHsn ? (
                <th className="py-2 pr-3 font-semibold">HSN</th>
              ) : null}
              <th className="py-2 pr-3 font-semibold text-right">Qty</th>
              <th className="py-2 pr-3 font-semibold text-right">Rate</th>
              <th className="py-2 pr-3 font-semibold text-right">Tax %</th>
              <th className="py-2 font-semibold text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item) => (
              <tr key={item.id} className="border-b border-line/80">
                <td className="py-3 pr-3 align-top">{item.description || "—"}</td>
                {country.showHsn ? (
                  <td className="py-3 pr-3 align-top text-ink-muted">
                    {item.hsn || "—"}
                  </td>
                ) : null}
                <td className="py-3 pr-3 text-right align-top tabular-nums">
                  {item.quantity}
                </td>
                <td className="py-3 pr-3 text-right align-top tabular-nums">
                  {money(item.rate)}
                </td>
                <td className="py-3 pr-3 text-right align-top tabular-nums">
                  {item.taxRate}%
                </td>
                <td className="py-3 text-right align-top tabular-nums font-medium">
                  {money(lineSubtotal(item))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-end">
        <dl className="w-full max-w-xs space-y-2 text-sm">
          <div className="flex justify-between gap-6">
            <dt className="text-ink-muted">Subtotal</dt>
            <dd className="tabular-nums font-medium">{money(totals.subtotal)}</dd>
          </div>
          {country.gstSplit && !invoice.interstate ? (
            <>
              <div className="flex justify-between gap-6">
                <dt className="text-ink-muted">CGST</dt>
                <dd className="tabular-nums">{money(totals.cgst ?? 0)}</dd>
              </div>
              <div className="flex justify-between gap-6">
                <dt className="text-ink-muted">SGST</dt>
                <dd className="tabular-nums">{money(totals.sgst ?? 0)}</dd>
              </div>
            </>
          ) : country.gstSplit && invoice.interstate ? (
            <div className="flex justify-between gap-6">
              <dt className="text-ink-muted">IGST</dt>
              <dd className="tabular-nums">{money(totals.igst ?? 0)}</dd>
            </div>
          ) : (
            <div className="flex justify-between gap-6">
              <dt className="text-ink-muted">{country.taxLabel}</dt>
              <dd className="tabular-nums">{money(totals.taxTotal)}</dd>
            </div>
          )}
          <div className="flex justify-between gap-6 border-t border-ink pt-2 text-base">
            <dt className="font-semibold">Total</dt>
            <dd className="tabular-nums font-semibold text-teal">
              {money(totals.grandTotal)}
            </dd>
          </div>
        </dl>
      </div>

      {invoice.notes ? (
        <div className="mt-8 border-t border-line pt-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted mb-1">
            Notes
          </p>
          <p className="text-sm whitespace-pre-wrap text-ink-muted">
            {invoice.notes}
          </p>
        </div>
      ) : null}

      <footer className="mt-10 border-t border-line pt-4">
        <p className="text-xs leading-relaxed text-ink-muted">
          {country.legalNote}
        </p>
      </footer>
    </article>
  );
}
