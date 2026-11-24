"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useCloudData } from "@/lib/cloud-store";

const NAV = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/invoices", label: "Invoices" },
  { href: "/invoices/new", label: "New invoice" },
  { href: "/setup", label: "Setup" },
  { href: "/account", label: "Account" },
];

export function AppShell({
  children,
  title,
  actions,
}: {
  children: ReactNode;
  title?: string;
  actions?: ReactNode;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const data = useCloudData();
  const businessName = data.business?.name;

  return (
    <div className="min-h-screen">
      <header className="no-print border-b border-line/80 bg-paper/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-6">
            <Link href="/" className="group flex items-baseline gap-1.5">
              <span className="font-[family-name:var(--font-display)] text-xl font-semibold tracking-tight text-ink group-hover:text-teal transition-colors">
                BillFora
              </span>
            </Link>
            <nav className="hidden sm:flex items-center gap-1">
              {NAV.map((item) => {
                const active =
                  pathname === item.href ||
                  (item.href !== "/dashboard" &&
                    item.href !== "/invoices/new" &&
                    pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                      active
                        ? "bg-teal-soft text-teal"
                        : "text-ink-muted hover:text-ink"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            {businessName ? (
              <p className="truncate text-sm text-ink-muted max-w-[8rem] sm:max-w-xs">
                {businessName}
              </p>
            ) : (
              <Link href="/setup" className="btn btn-primary text-sm py-1.5 px-3">
                Business setup
              </Link>
            )}
            {session?.user ? (
              <button
                type="button"
                className="btn btn-ghost text-sm py-1.5 px-2"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                Sign out
              </button>
            ) : (
              <Link href="/login" className="btn btn-ghost text-sm py-1.5 px-2">
                Sign in
              </Link>
            )}
          </div>
        </div>
        <nav className="sm:hidden flex gap-1 overflow-x-auto border-t border-line/60 px-3 py-2">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`shrink-0 rounded-md px-3 py-1 text-xs font-medium ${
                  active ? "bg-teal-soft text-teal" : "text-ink-muted"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {(title || actions) && (
          <div className="no-print mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            {title ? <h1 className="page-title">{title}</h1> : <div />}
            {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
