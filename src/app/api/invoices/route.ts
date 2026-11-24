import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getCountry, type CountryCode } from "@/lib/countries";

const clientSchema = z.object({
  name: z.string(),
  email: z.string().optional().default(""),
  phone: z.string().optional().default(""),
  addressLine1: z.string().optional().default(""),
  addressLine2: z.string().optional().default(""),
  city: z.string().optional().default(""),
  state: z.string().optional().default(""),
  postalCode: z.string().optional().default(""),
  country: z.string().optional().default(""),
  taxId: z.string().optional().default(""),
});

const lineSchema = z.object({
  id: z.string(),
  description: z.string(),
  quantity: z.number(),
  rate: z.number(),
  taxRate: z.number(),
  hsn: z.string().optional(),
});

const createSchema = z.object({
  status: z.enum(["draft", "sent", "paid"]),
  issueDate: z.string(),
  dueDate: z.string(),
  notes: z.string().optional().default(""),
  interstate: z.boolean().optional().default(false),
  client: clientSchema,
  items: z.array(lineSchema).min(1),
});

function serializeInvoice(row: {
  id: string;
  number: string;
  status: string;
  issueDate: string;
  dueDate: string;
  notes: string;
  interstate: boolean;
  clientJson: string;
  itemsJson: string;
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
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [business, rows] = await Promise.all([
    prisma.business.findUnique({ where: { userId: session.user.id } }),
    prisma.invoice.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return NextResponse.json({
    business,
    invoices: rows.map(serializeInvoice),
    nextInvoiceSeq: business?.nextInvoiceSeq ?? 1,
    plan: session.user.plan,
  });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = createSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid invoice" }, { status: 400 });
  }

  const business = await prisma.business.findUnique({
    where: { userId: session.user.id },
  });
  if (!business) {
    return NextResponse.json(
      { error: "Set up your business profile first" },
      { status: 400 }
    );
  }

  // Free plan: 15 invoices / month
  if (session.user.plan === "free") {
    const start = new Date();
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
    const count = await prisma.invoice.count({
      where: { userId: session.user.id, createdAt: { gte: start } },
    });
    if (count >= 15) {
      return NextResponse.json(
        {
          error:
            "Free plan limit: 15 invoices this month. Upgrade to create more.",
        },
        { status: 402 }
      );
    }
  }

  const pack = getCountry(business.countryCode as CountryCode);
  const seq = business.nextInvoiceSeq;
  const number = `${pack.numberPrefix}${String(seq).padStart(4, "0")}`;

  const invoice = await prisma.$transaction(async (tx) => {
    const created = await tx.invoice.create({
      data: {
        userId: session.user!.id,
        number,
        status: parsed.data.status,
        issueDate: parsed.data.issueDate,
        dueDate: parsed.data.dueDate,
        notes: parsed.data.notes ?? "",
        interstate: parsed.data.interstate ?? false,
        clientJson: JSON.stringify(parsed.data.client),
        itemsJson: JSON.stringify(parsed.data.items),
      },
    });
    await tx.business.update({
      where: { userId: session.user!.id },
      data: { nextInvoiceSeq: seq + 1 },
    });
    return created;
  });

  return NextResponse.json(
    { invoice: serializeInvoice(invoice) },
    { status: 201 }
  );
}
