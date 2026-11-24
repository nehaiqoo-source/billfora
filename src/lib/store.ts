"use client";

import { useSyncExternalStore } from "react";
import type { AppData, BusinessProfile, Invoice } from "./types";

const STORAGE_KEY = "billfora-app-data-v1";

const EMPTY: AppData = {
  business: null,
  invoices: [],
  nextInvoiceSeq: 1,
};

let memoryCache: AppData | null = null;
const listeners = new Set<() => void>();

function readRaw(): AppData {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as AppData;
    return {
      business: parsed.business ?? null,
      invoices: Array.isArray(parsed.invoices) ? parsed.invoices : [],
      nextInvoiceSeq:
        typeof parsed.nextInvoiceSeq === "number" && parsed.nextInvoiceSeq > 0
          ? parsed.nextInvoiceSeq
          : 1,
    };
  } catch {
    return EMPTY;
  }
}

function getSnapshot(): AppData {
  if (memoryCache) return memoryCache;
  memoryCache = readRaw();
  return memoryCache;
}

function getServerSnapshot(): AppData {
  return EMPTY;
}

function write(data: AppData) {
  memoryCache = data;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      memoryCache = readRaw();
      listener();
    }
  };
  if (typeof window !== "undefined") {
    window.addEventListener("storage", onStorage);
  }
  return () => {
    listeners.delete(listener);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", onStorage);
    }
  };
}

export function useAppData(): AppData {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function saveBusiness(business: BusinessProfile) {
  const current = getSnapshot();
  write({ ...current, business });
}

export function saveInvoice(invoice: Invoice, consumeSeq: boolean) {
  const current = getSnapshot();
  const existing = current.invoices.findIndex((i) => i.id === invoice.id);
  let invoices: Invoice[];
  if (existing >= 0) {
    invoices = [...current.invoices];
    invoices[existing] = invoice;
  } else {
    invoices = [invoice, ...current.invoices];
  }
  write({
    ...current,
    invoices,
    nextInvoiceSeq: consumeSeq
      ? current.nextInvoiceSeq + 1
      : current.nextInvoiceSeq,
  });
}

export function updateInvoice(invoice: Invoice) {
  const current = getSnapshot();
  const invoices = current.invoices.map((i) =>
    i.id === invoice.id ? invoice : i
  );
  write({ ...current, invoices });
}

export function deleteInvoice(id: string) {
  const current = getSnapshot();
  write({
    ...current,
    invoices: current.invoices.filter((i) => i.id !== id),
  });
}

export function formatInvoiceNumber(prefix: string, seq: number): string {
  return `${prefix}${String(seq).padStart(4, "0")}`;
}

export function clearAllData() {
  write(EMPTY);
}
