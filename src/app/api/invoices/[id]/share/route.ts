import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getRequestUser } from "@/lib/request-user";
import { newShareToken, serializeInvoice } from "@/lib/invoice-serialize";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: Request, ctx: Ctx) {
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

  const row = existing.shareToken
    ? existing
    : await prisma.invoice.update({
        where: { id },
        data: {
          shareToken: newShareToken(),
          sharedAt: new Date(),
        },
      });

  const origin = new URL(req.url).origin;
  const url = `${origin}/i/${row.shareToken}`;

  return NextResponse.json({
    invoice: serializeInvoice(row),
    shareUrl: url,
  });
}
