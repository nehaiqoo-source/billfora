"use client";

import { use, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { InvoiceDocument } from "@/components/InvoiceDocument";
import { patchInvoiceCloud, useCloudData } from "@/lib/cloud-store";

export default function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const data = useCloudData();
  const business = data.business;
  const invoice = data.invoices.find((i) => i.id === id);
  const [busy, setBusy] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [shareMsg, setShareMsg] = useState<string | null>(null);

  if (data.loading) {
    return (
      <AppShell title="Invoice">
        <p className="text-ink-muted">Loading…</p>
      </AppShell>
    );
  }

  if (!business) {
    return (
      <AppShell title="Invoice">
        <div className="panel max-w-lg">
          <p className="text-sm text-ink-muted">
            No business profile on this account yet.
          </p>
          <Link href="/setup" className="btn btn-primary mt-4 inline-flex">
            Open setup
          </Link>
        </div>
      </AppShell>
    );
  }

  if (!invoice) {
    return (
      <AppShell title="Invoice">
        <div className="panel max-w-lg">
          <p className="text-sm text-ink-muted">Invoice not found.</p>
          <Link href="/invoices" className="btn btn-secondary mt-4 inline-flex">
            Back to invoices
          </Link>
        </div>
      </AppShell>
    );
  }

  async function markPaid() {
    setBusy(true);
    try {
      await patchInvoiceCloud(invoice!.id, { status: "paid" });
      await data.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function copyShareLink() {
    setBusy(true);
    setShareMsg(null);
    try {
      const res = await fetch(`/api/invoices/${invoice!.id}/share`, {
        method: "POST",
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Could not create share link");
      }
      const url = json.shareUrl as string;
      setShareUrl(url);
      await navigator.clipboard.writeText(url);
      setShareMsg("Link copied");
      await data.refresh();
    } catch (e) {
      setShareMsg(e instanceof Error ? e.message : "Share failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AppShell
      title={invoice.number}
      actions={
        <>
          {invoice.status !== "paid" ? (
            <button
              type="button"
              className="btn btn-secondary"
              disabled={busy}
              onClick={() => void markPaid()}
            >
              Mark paid
            </button>
          ) : (
            <span className="self-center text-sm font-medium text-teal">
              Paid
            </span>
          )}
          <button
            type="button"
            className="btn btn-secondary"
            disabled={busy}
            onClick={() => void copyShareLink()}
          >
            Copy share link
          </button>
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
      {shareMsg || shareUrl ? (
        <p className="no-print mb-4 text-sm text-ink-muted">
          {shareMsg}
          {shareUrl ? (
            <>
              {" · "}
              <a href={shareUrl} className="text-teal underline break-all">
                {shareUrl}
              </a>
            </>
          ) : null}
        </p>
      ) : null}
      <InvoiceDocument invoice={invoice} business={business} />
    </AppShell>
  );
}
