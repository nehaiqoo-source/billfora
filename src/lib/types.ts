import type { CountryCode } from "./countries";

export type BusinessProfile = {
  name: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  countryCode: CountryCode;
  taxId: string;
  defaultTaxRate: number;
};

export type Client = {
  name: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  taxId: string;
};

export type LineItem = {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  taxRate: number;
  hsn?: string;
};

export type InvoiceStatus = "draft" | "sent" | "paid";

export type Invoice = {
  id: string;
  number: string;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  client: Client;
  items: LineItem[];
  notes: string;
  /** India only: true = IGST (interstate), false = CGST+SGST (intra-state) */
  interstate?: boolean;
  shareToken?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AppData = {
  business: BusinessProfile | null;
  invoices: Invoice[];
  nextInvoiceSeq: number;
};
