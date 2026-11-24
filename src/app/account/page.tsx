"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { AppShell } from "@/components/AppShell";
import { useCloudData } from "@/lib/cloud-store";

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: "₹0",
    blurb: "15 invoices per month on the web app.",
  },
  {
    id: "starter",
    name: "Starter",
    price: "₹399/mo",
    blurb: "Unlimited invoices, plus Mac and Windows downloads when those builds ship.",
  },
  {
    id: "business",
    name: "Business",
    price: "₹999/mo",
    blurb: "Extra seats, GST report exports, and faster support.",
  },
];

export default function AccountPage() {
  const { data: session } = useSession();
  const cloud = useCloudData();
  const plan = cloud.plan || session?.user?.plan || "free";

  return (
    <AppShell title="Account">
      <div className="max-w-3xl space-y-8">
        <div className="panel">
          <p className="text-sm text-ink-muted">Signed in as</p>
          <p className="mt-1 font-medium">{session?.user?.email}</p>
          <p className="mt-3 text-sm">
            Plan:{" "}
            <span className="font-semibold capitalize text-teal">{plan}</span>
          </p>
        </div>

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold">
            Plans
          </h2>
          <p className="mt-2 text-sm text-ink-muted">
            Checkout with Razorpay is not wired yet. Paid plans will unlock the
            desktop apps under this same login.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {PLANS.map((p) => (
              <div
                key={p.id}
                className={`panel ${
                  plan === p.id ? "ring-2 ring-teal" : ""
                }`}
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                  {p.name}
                </p>
                <p className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold">
                  {p.price}
                </p>
                <p className="mt-2 text-sm text-ink-muted">{p.blurb}</p>
                {plan === p.id ? (
                  <p className="mt-4 text-sm font-medium text-teal">Your plan</p>
                ) : (
                  <button
                    type="button"
                    className="btn btn-secondary mt-4 w-full text-sm"
                    disabled
                    title="Razorpay not connected yet"
                  >
                    Upgrade (soon)
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        <p className="text-sm text-ink-muted">
          <Link href="/dashboard" className="text-teal underline">
            Back to dashboard
          </Link>
        </p>
      </div>
    </AppShell>
  );
}
