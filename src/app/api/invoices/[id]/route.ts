import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const patchSchema = z.object({
  status: z.enum(["draft", "sent", "paid"]).optional(),
  notes: z.string().optional(),
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

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;
  const row = await prisma.invoice.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!row) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const business = await prisma.business.findUnique({
    where: { userId: session.user.id },
  });

  return NextResponse.json({
    invoice: serializeInvoice(row),
    business,
  });
}

export async function PATCH(req: Request, ctx: Ctx) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;
  const parsed = patchSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid patch" }, { status: 400 });
  }

  const existing = await prisma.invoice.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const row = await prisma.invoice.update({
    where: { id },
    data: parsed.data,
  });

  return NextResponse.json({ invoice: serializeInvoice(row) });
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;
  const existing = await prisma.invoice.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.invoice.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
