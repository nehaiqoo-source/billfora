"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { AppShell } from "@/components/AppShell";
import { getCountry } from "@/lib/countries";
import {
  formatInvoiceNumber,
  saveInvoice,
  useAppData,
} from "@/lib/store";
import {
  computeInvoiceTotals,
  formatMoney,
  lineSubtotal,
} from "@/lib/tax";
import type { Client, LineItem } from "@/lib/types";

function emptyClient(): Client {
  return {
    name: "",
    email: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    taxId: "",
  };
}

function emptyItem(taxRate: number): LineItem {
  return {
    id: uuidv4(),
    description: "",
    quantity: 1,
    rate: 0,
    taxRate,
    hsn: "",
  };
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function plusDaysISO(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export default function NewInvoicePage() {
  const data = useAppData();
  const router = useRouter();
  const business = data.business;

  const [client, setClient] = useState<Client>(emptyClient);
  const [items, setItems] = useState<LineItem[]>(() => [emptyItem(0)]);
  const [issueDate, setIssueDate] = useState(todayISO);
  const [dueDate, setDueDate] = useState(() => plusDaysISO(14));
  const [notes, setNotes] = useState("");
  const [interstate, setInterstate] = useState(false);
  const [taxSynced, setTaxSynced] = useState(false);

  useEffect(() => {
    if (business && !taxSynced) {
      setItems((prev) =>
        prev.map((it) =>
          it.description || it.rate
            ? it
            : { ...it, taxRate: business.defaultTaxRate }
        )
      );
      setTaxSynced(true);
    }
  }, [business, taxSynced]);

  if (!business) {
    return (
      <AppShell title="New invoice">
        <div className="panel max-w-lg">
          <p className="text-sm text-ink-muted">
            Set up your business profile before creating invoices.
          </p>
          <Link href="/setup" className="btn btn-primary mt-4 inline-flex">
            Go to setup
          </Link>
        </div>
      </AppShell>
    );
  }

  const country = getCountry(business.countryCode);
  const totals = computeInvoiceTotals(items, country, interstate);
  const money = (n: number) =>
    formatMoney(n, country.currency, country.locale);

  function updateItem(id: string, patch: Partial<LineItem>) {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, ...patch } : it))
    );
  }

  function addItem() {
    setItems((prev) => [...prev, emptyItem(business!.defaultTaxRate)]);
  }

  function removeItem(id: string) {
    setItems((prev) => (prev.length <= 1 ? prev : prev.filter((i) => i.id !== id)));
  }

  function persist(status: "draft" | "sent") {
    const id = uuidv4();
    const number = formatInvoiceNumber(
      country.numberPrefix,
      data.nextInvoiceSeq
    );
    const now = new Date().toISOString();
    const invoice = {
      id,
      number,
      status,
      issueDate,
      dueDate,
      client,
      items: items.map((it) => ({
        ...it,
        quantity: Number(it.quantity) || 0,
        rate: Number(it.rate) || 0,
        taxRate: Number(it.taxRate) || 0,
      })),
      notes,
      interstate: country.gstSplit ? interstate : undefined,
      createdAt: now,
      updatedAt: now,
    };
    saveInvoice(invoice, true);
    router.push(`/invoices/${id}`);
  }

  return (
    <AppShell
      title="New invoice"
      actions={
        <>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => persist("draft")}
          >
            Save draft
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => persist("sent")}
          >
            Create &amp; view
          </button>
        </>
      }
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
        <div className="space-y-6">
          <section className="panel space-y-4">
            <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold">
              Client
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="field sm:col-span-2">
                <label htmlFor="clientName">Name</label>
                <input
                  id="clientName"
                  value={client.name}
                  onChange={(e) =>
                    setClient({ ...client, name: e.target.value })
                  }
                  placeholder="Client or company"
                />
              </div>
              <div className="field">
                <label htmlFor="clientEmail">Email</label>
                <input
                  id="clientEmail"
                  type="email"
                  value={client.email}
                  onChange={(e) =>
                    setClient({ ...client, email: e.target.value })
                  }
                />
              </div>
              <div className="field">
                <label htmlFor="clientTaxId">{country.taxIdLabel}</label>
                <input
                  id="clientTaxId"
                  value={client.taxId}
                  onChange={(e) =>
                    setClient({ ...client, taxId: e.target.value })
                  }
                />
              </div>
              <div className="field sm:col-span-2">
                <label htmlFor="clientAddr">Address</label>
                <input
                  id="clientAddr"
                  value={client.addressLine1}
                  onChange={(e) =>
                    setClient({ ...client, addressLine1: e.target.value })
                  }
                />
              </div>
              <div className="field">
                <label htmlFor="clientCity">City</label>
                <input
                  id="clientCity"
                  value={client.city}
                  onChange={(e) =>
                    setClient({ ...client, city: e.target.value })
                  }
                />
              </div>
              <div className="field">
                <label htmlFor="clientState">State</label>
                <input
                  id="clientState"
                  value={client.state}
                  onChange={(e) =>
                    setClient({ ...client, state: e.target.value })
                  }
                />
              </div>
              <div className="field">
                <label htmlFor="clientZip">Postal code</label>
                <input
                  id="clientZip"
                  value={client.postalCode}
                  onChange={(e) =>
                    setClient({ ...client, postalCode: e.target.value })
                  }
                />
              </div>
              <div className="field">
                <label htmlFor="clientCountry">Country</label>
                <input
                  id="clientCountry"
                  value={client.country}
                  onChange={(e) =>
                    setClient({ ...client, country: e.target.value })
                  }
                />
              </div>
            </div>
          </section>

          <section className="panel space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold">
                Line items
              </h2>
              <button type="button" className="btn btn-secondary" onClick={addItem}>
                Add line
              </button>
            </div>

            {country.gstSplit ? (
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={interstate}
                  onChange={(e) => setInterstate(e.target.checked)}
                  className="size-4 accent-teal"
                />
                Interstate supply (apply IGST instead of CGST + SGST)
              </label>
            ) : null}

            <div className="space-y-4">
              {items.map((item, idx) => (
                <div
                  key={item.id}
                  className="grid gap-3 border-t border-line pt-4 first:border-0 first:pt-0 sm:grid-cols-12"
                >
                  <div className="field sm:col-span-5">
                    <label>Description {idx + 1}</label>
                    <input
                      value={item.description}
                      onChange={(e) =>
                        updateItem(item.id, { description: e.target.value })
                      }
                      placeholder="Service or product"
                    />
                  </div>
                  {country.showHsn ? (
                    <div className="field sm:col-span-2">
                      <label>HSN / SAC</label>
                      <input
                        value={item.hsn ?? ""}
                        onChange={(e) =>
                          updateItem(item.id, { hsn: e.target.value })
                        }
                      />
                    </div>
                  ) : null}
                  <div className="field sm:col-span-1">
                    <label>Qty</label>
                    <input
                      type="number"
                      min={0}
                      step={1}
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(item.id, {
                          quantity: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div className="field sm:col-span-2">
                    <label>Rate</label>
                    <input
                      type="number"
                      min={0}
                      step={0.01}
                      value={item.rate}
                      onChange={(e) =>
                        updateItem(item.id, { rate: Number(e.target.value) })
                      }
                    />
                  </div>
                  <div className="field sm:col-span-1">
                    <label>Tax %</label>
                    <input
                      type="number"
                      min={0}
                      step={0.01}
                      value={item.taxRate}
                      onChange={(e) =>
                        updateItem(item.id, {
                          taxRate: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div className="flex items-end gap-2 sm:col-span-12 lg:col-span-1">
                    <p className="text-sm tabular-nums text-ink-muted flex-1">
                      {money(lineSubtotal(item))}
                    </p>
                    <button
                      type="button"
                      className="btn btn-ghost text-danger px-2"
                      onClick={() => removeItem(item.id)}
                      aria-label="Remove line"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="panel grid gap-4 sm:grid-cols-2">
            <div className="field">
              <label htmlFor="issueDate">Issue date</label>
              <input
                id="issueDate"
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="dueDate">Due date</label>
              <input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
            <div className="field sm:col-span-2">
              <label htmlFor="notes">Notes</label>
              <textarea
                id="notes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Payment terms, bank details…"
              />
            </div>
          </section>
        </div>

        <aside className="panel h-fit sticky top-24 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
            Live totals
          </p>
          <p className="text-sm text-ink-muted">
            Next number:{" "}
            <span className="font-medium text-ink">
              {formatInvoiceNumber(country.numberPrefix, data.nextInvoiceSeq)}
            </span>
          </p>
          <div className="flex justify-between text-sm">
            <span className="text-ink-muted">Subtotal</span>
            <span className="tabular-nums">{money(totals.subtotal)}</span>
          </div>
          {country.gstSplit && !interstate ? (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-ink-muted">CGST</span>
                <span className="tabular-nums">{money(totals.cgst ?? 0)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-ink-muted">SGST</span>
                <span className="tabular-nums">{money(totals.sgst ?? 0)}</span>
              </div>
            </>
          ) : country.gstSplit && interstate ? (
            <div className="flex justify-between text-sm">
              <span className="text-ink-muted">IGST</span>
              <span className="tabular-nums">{money(totals.igst ?? 0)}</span>
            </div>
          ) : (
            <div className="flex justify-between text-sm">
              <span className="text-ink-muted">{country.taxLabel}</span>
              <span className="tabular-nums">{money(totals.taxTotal)}</span>
            </div>
          )}
          <div className="flex justify-between border-t border-line pt-3 text-base font-semibold">
            <span>Total</span>
            <span className="tabular-nums text-teal">
              {money(totals.grandTotal)}
            </span>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
