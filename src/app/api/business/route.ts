import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getRequestUser } from "@/lib/request-user";

const businessSchema = z.object({
  name: z.string().min(1),
  email: z.string().optional().default(""),
  phone: z.string().optional().default(""),
  addressLine1: z.string().optional().default(""),
  addressLine2: z.string().optional().default(""),
  city: z.string().optional().default(""),
  state: z.string().optional().default(""),
  postalCode: z.string().optional().default(""),
  countryCode: z.string().min(2).max(2),
  taxId: z.string().optional().default(""),
  defaultTaxRate: z.number().min(0).max(100),
});

export async function GET(req: Request) {
  const user = await getRequestUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const business = await prisma.business.findUnique({
    where: { userId: user.id },
  });

  return NextResponse.json({ business });
}

export async function PUT(req: Request) {
  const user = await getRequestUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = businessSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid business data" }, { status: 400 });
  }

  const data = parsed.data;
  const business = await prisma.business.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      ...data,
    },
    update: data,
  });

  return NextResponse.json({ business });
}
