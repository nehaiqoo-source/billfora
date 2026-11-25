import { API_BASE } from "./config";

export type MobileUser = {
  id: string;
  email: string;
  name: string | null;
  plan: string;
};

export type InvoiceListItem = {
  id: string;
  number: string;
  status: string;
  issueDate: string;
  dueDate: string;
  notes: string;
  client: { name: string };
  items: { description: string; quantity: number; rate: number; taxRate: number }[];
};

async function parseJson(res: Response) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      typeof data.error === "string" ? data.error : `Request failed (${res.status})`
    );
  }
  return data;
}

export async function loginWithPassword(email: string, password: string) {
  const res = await fetch(`${API_BASE}/api/auth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return parseJson(res) as Promise<{ token: string; user: MobileUser }>;
}

export async function fetchInvoices(token: string) {
  const res = await fetch(`${API_BASE}/api/invoices`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return parseJson(res) as Promise<{
    invoices: InvoiceListItem[];
    business: { name: string; countryCode: string } | null;
    plan: string;
  }>;
}

export async function fetchInvoice(token: string, id: string) {
  const res = await fetch(`${API_BASE}/api/invoices/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return parseJson(res) as Promise<{
    invoice: InvoiceListItem & {
      client: Record<string, string>;
      items: {
        id: string;
        description: string;
        quantity: number;
        rate: number;
        taxRate: number;
      }[];
    };
    business: { name: string; countryCode: string } | null;
  }>;
}

export async function patchInvoiceStatus(
  token: string,
  id: string,
  status: "draft" | "sent" | "paid"
) {
  const res = await fetch(`${API_BASE}/api/invoices/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });
  return parseJson(res);
}

export type CreateInvoiceInput = {
  status: "draft" | "sent" | "paid";
  issueDate: string;
  dueDate: string;
  notes?: string;
  interstate?: boolean;
  client: {
    name: string;
    email?: string;
    phone?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    taxId?: string;
  };
  items: {
    id: string;
    description: string;
    quantity: number;
    rate: number;
    taxRate: number;
    hsn?: string;
  }[];
};

export async function createInvoice(token: string, body: CreateInvoiceInput) {
  const res = await fetch(`${API_BASE}/api/invoices`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return parseJson(res) as Promise<{ invoice: InvoiceListItem }>;
}

export async function createShareLink(token: string, id: string) {
  const res = await fetch(`${API_BASE}/api/invoices/${id}/share`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  return parseJson(res) as Promise<{ shareUrl: string }>;
}
