"use client";

import { use } from "react";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { InvoiceDocument } from "@/components/InvoiceDocument";
import { updateInvoice, useAppData } from "@/lib/store";

export default function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const data = useAppData();
  const business = data.business;
  const invoice = data.invoices.find((i) => i.id === id);

  if (!business) {
    return (
      <AppShell title="Invoice">
        <div className="panel max-w-lg">
          <p className="text-sm text-ink-muted">Business profile missing.</p>
          <Link href="/setup" className="btn btn-primary mt-4 inline-flex">
            Go to setup
          </Link>
        </div>
      </AppShell>
    );
  }

  if (!invoice) {
    return (
      <AppShell title="Invoice">
        <div className="panel max-w-lg">
          <p className="text-sm text-ink-muted">
            Invoice not found in this browser&apos;s storage.
          </p>
          <Link href="/invoices" className="btn btn-secondary mt-4 inline-flex">
            Back to invoices
          </Link>
        </div>
      </AppShell>
    );
  }

  function markPaid() {
    updateInvoice({
      ...invoice!,
      status: "paid",
      updatedAt: new Date().toISOString(),
    });
  }

  return (
    <AppShell
      title={invoice.number}
      actions={
        <>
          {invoice.status !== "paid" ? (
            <button type="button" className="btn btn-secondary" onClick={markPaid}>
              Mark paid
            </button>
          ) : (
            <span className="self-center text-sm font-medium text-teal">
              Paid
            </span>
          )}
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => window.print()}
          >
            Print / PDF
          </button>
          <Link href="/invoices" className="btn btn-ghost">
            All invoices
          </Link>
        </>
      }
    >
      <InvoiceDocument invoice={invoice} business={business} />
    </AppShell>
  );
}
