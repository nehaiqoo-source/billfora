"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import type { BusinessProfile, Invoice } from "./types";
import type { CountryCode } from "./countries";

export type CloudAppData = {
  business: BusinessProfile | null;
  invoices: Invoice[];
  nextInvoiceSeq: number;
  plan: string;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

function mapBusiness(raw: Record<string, unknown> | null): BusinessProfile | null {
  if (!raw) return null;
  return {
    name: String(raw.name ?? ""),
    email: String(raw.email ?? ""),
    phone: String(raw.phone ?? ""),
    addressLine1: String(raw.addressLine1 ?? ""),
    addressLine2: String(raw.addressLine2 ?? ""),
    city: String(raw.city ?? ""),
    state: String(raw.state ?? ""),
    postalCode: String(raw.postalCode ?? ""),
    countryCode: (raw.countryCode as CountryCode) ?? "IN",
    taxId: String(raw.taxId ?? ""),
    defaultTaxRate: Number(raw.defaultTaxRate ?? 0),
  };
}

export function useCloudData(): CloudAppData {
  const { status } = useSession();
  const [business, setBusiness] = useState<BusinessProfile | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [nextInvoiceSeq, setNextInvoiceSeq] = useState(1);
  const [plan, setPlan] = useState("free");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (status !== "authenticated") {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/invoices");
      if (!res.ok) {
        throw new Error("Failed to load account data");
      }
      const json = await res.json();
      setBusiness(mapBusiness(json.business));
      setInvoices(json.invoices ?? []);
      setNextInvoiceSeq(json.nextInvoiceSeq ?? 1);
      setPlan(json.plan ?? "free");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Load failed");
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      setLoading(false);
      return;
    }
    void refresh();
  }, [status, refresh]);

  return {
    business,
    invoices,
    nextInvoiceSeq,
    plan,
    loading,
    error,
    refresh,
  };
}

export async function saveBusinessCloud(
  business: BusinessProfile
): Promise<void> {
  const res = await fetch("/api/business", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(business),
  });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.error || "Could not save business");
  }
}

export async function createInvoiceCloud(input: {
  status: "draft" | "sent" | "paid";
  issueDate: string;
  dueDate: string;
  notes: string;
  interstate?: boolean;
  client: Invoice["client"];
  items: Invoice["items"];
}): Promise<Invoice> {
  const res = await fetch("/api/invoices", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json.error || "Could not create invoice");
  }
  return json.invoice as Invoice;
}

export async function patchInvoiceCloud(
  id: string,
  patch: { status?: Invoice["status"]; notes?: string }
): Promise<Invoice> {
  const res = await fetch(`/api/invoices/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json.error || "Could not update invoice");
  }
  return json.invoice as Invoice;
}
