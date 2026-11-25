export function serializeInvoice(row: {
  id: string;
  number: string;
  status: string;
  issueDate: string;
  dueDate: string;
  notes: string;
  interstate: boolean;
  clientJson: string;
  itemsJson: string;
  shareToken?: string | null;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: row.id,
    number: row.number,
    status: row.status,
    issueDate: row.issueDate,
    dueDate: row.dueDate,
    notes: row.notes,
    interstate: row.interstate,
    client: JSON.parse(row.clientJson),
    items: JSON.parse(row.itemsJson),
    shareToken: row.shareToken ?? null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export function newShareToken() {
  const bytes = new Uint8Array(12);
  crypto.getRandomValues(bytes);
  return Buffer.from(bytes).toString("base64url");
}
