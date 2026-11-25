import Link from "next/link";
import { notFound } from "next/navigation";
import { InvoiceDocument } from "@/components/InvoiceDocument";
import { PrintButton } from "@/components/PrintButton";
import { prisma } from "@/lib/prisma";
import type { BusinessProfile, Invoice } from "@/lib/types";
import type { CountryCode } from "@/lib/countries";

type Props = { params: Promise<{ token: string }> };

export default async function PublicInvoicePage({ params }: Props) {
  const { token } = await params;
  const row = await prisma.invoice.findUnique({
    where: { shareToken: token },
  });
  if (!row) notFound();

  const businessRow = await prisma.business.findUnique({
    where: { userId: row.userId },
  });
  if (!businessRow) notFound();

  const business: BusinessProfile = {
    name: businessRow.name,
    email: businessRow.email,
    phone: businessRow.phone,
    addressLine1: businessRow.addressLine1,
    addressLine2: businessRow.addressLine2,
    city: businessRow.city,
    state: businessRow.state,
    postalCode: businessRow.postalCode,
    countryCode: businessRow.countryCode as CountryCode,
    taxId: businessRow.taxId,
    defaultTaxRate: businessRow.defaultTaxRate,
  };

  const invoice: Invoice = {
    id: row.id,
    number: row.number,
    status: row.status as Invoice["status"],
    issueDate: row.issueDate,
    dueDate: row.dueDate,
    notes: row.notes,
    interstate: row.interstate,
    client: JSON.parse(row.clientJson),
    items: JSON.parse(row.itemsJson),
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };

  return (
    <div className="min-h-screen bg-[#f2f5f4]">
      <header className="no-print mx-auto flex max-w-3xl items-center justify-between px-4 py-5 sm:px-6">
        <Link
          href="/"
          className="font-[family-name:var(--font-display)] text-xl font-semibold text-ink"
        >
          BillFora
        </Link>
        <PrintButton />
      </header>
      <main className="mx-auto max-w-3xl px-4 pb-16 sm:px-6">
        <p className="no-print mb-4 text-sm text-ink-muted">
          Shared invoice · status{" "}
          <span className="font-medium capitalize text-teal">
            {invoice.status}
          </span>
        </p>
        <InvoiceDocument invoice={invoice} business={business} />
      </main>
    </div>
  );
}
