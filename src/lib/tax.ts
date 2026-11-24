import type { CountryPack, DateFormat } from "./countries";
import type { LineItem } from "./types";

export function lineSubtotal(item: LineItem): number {
  return round2(item.quantity * item.rate);
}

export type InvoiceTotals = {
  subtotal: number;
  taxTotal: number;
  grandTotal: number;
  /** India GST split amounts (only set when gstSplit applies) */
  cgst?: number;
  sgst?: number;
  igst?: number;
};

export function computeInvoiceTotals(
  items: LineItem[],
  country: CountryPack,
  interstate = false
): InvoiceTotals {
  let subtotal = 0;
  let taxTotal = 0;

  for (const item of items) {
    const line = lineSubtotal(item);
    subtotal += line;
    taxTotal += round2(line * (item.taxRate / 100));
  }

  subtotal = round2(subtotal);
  taxTotal = round2(taxTotal);
  const grandTotal = round2(subtotal + taxTotal);

  if (country.gstSplit) {
    if (interstate) {
      return { subtotal, taxTotal, grandTotal, igst: taxTotal };
    }
    const half = round2(taxTotal / 2);
    // Keep CGST+SGST summing to taxTotal even with odd cents
    const cgst = half;
    const sgst = round2(taxTotal - half);
    return { subtotal, taxTotal, grandTotal, cgst, sgst };
  }

  return { subtotal, taxTotal, grandTotal };
}

export function formatMoney(
  amount: number,
  currency: string,
  locale: string
): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits: currency === "JPY" ? 0 : 2,
      maximumFractionDigits: currency === "JPY" ? 0 : 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

export function formatDate(isoDate: string, format: DateFormat): string {
  const d = new Date(isoDate + (isoDate.length === 10 ? "T12:00:00" : ""));
  if (Number.isNaN(d.getTime())) return isoDate;

  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = String(d.getFullYear());

  switch (format) {
    case "MM/DD/YYYY":
      return `${mm}/${dd}/${yyyy}`;
    case "YYYY-MM-DD":
      return `${yyyy}-${mm}-${dd}`;
    case "DD.MM.YYYY":
      return `${dd}.${mm}.${yyyy}`;
    case "YYYY/MM/DD":
      return `${yyyy}/${mm}/${dd}`;
    case "DD-MM-YYYY":
      return `${dd}-${mm}-${yyyy}`;
    case "DD/MM/YYYY":
    default:
      return `${dd}/${mm}/${yyyy}`;
  }
}

function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}
