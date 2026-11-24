import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";

export type RequestUser = {
  id: string;
  email: string;
  plan: string;
};

function secretKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET is not set");
  return new TextEncoder().encode(secret);
}

export async function verifyAccessToken(
  token: string
): Promise<RequestUser | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey());
    if (!payload.sub || typeof payload.email !== "string") return null;
    return {
      id: payload.sub,
      email: payload.email,
      plan: typeof payload.plan === "string" ? payload.plan : "free",
    };
  } catch {
    return null;
  }
}

/** Session cookie (web) or Bearer token (mobile / desktop). */
export async function getRequestUser(
  req?: Request
): Promise<RequestUser | null> {
  if (req) {
    const header = req.headers.get("authorization");
    if (header?.startsWith("Bearer ")) {
      const token = header.slice(7).trim();
      const fromJwt = await verifyAccessToken(token);
      if (fromJwt) {
        const user = await prisma.user.findUnique({
          where: { id: fromJwt.id },
          select: { id: true, email: true, plan: true },
        });
        if (!user) return null;
        return { id: user.id, email: user.email, plan: user.plan };
      }
    }
  }

  const session = await auth();
  if (!session?.user?.id || !session.user.email) return null;
  return {
    id: session.user.id,
    email: session.user.email,
    plan: session.user.plan ?? "free",
  };
}

export { secretKey };
