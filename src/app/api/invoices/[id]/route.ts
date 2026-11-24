import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getRequestUser } from "@/lib/request-user";

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

export async function GET(req: Request, ctx: Ctx) {
  const user = await getRequestUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;
  const row = await prisma.invoice.findFirst({
    where: { id, userId: user.id },
  });
  if (!row) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const business = await prisma.business.findUnique({
    where: { userId: user.id },
  });

  return NextResponse.json({
    invoice: serializeInvoice(row),
    business,
  });
}

export async function PATCH(req: Request, ctx: Ctx) {
  const user = await getRequestUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;
  const parsed = patchSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid patch" }, { status: 400 });
  }

  const existing = await prisma.invoice.findFirst({
    where: { id, userId: user.id },
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

export async function DELETE(req: Request, ctx: Ctx) {
  const user = await getRequestUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;
  const existing = await prisma.invoice.findFirst({
    where: { id, userId: user.id },
  });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.invoice.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
