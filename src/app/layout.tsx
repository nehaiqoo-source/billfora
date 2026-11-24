import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "BillFora — Country-aware invoices",
    template: "%s · BillFora",
  },
  description:
    "Generate invoices that match your country’s tax labels, currency, dates, and legal notes. Local-first MVP, no account required.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${dmSans.variable}`}>
      <body className="antialiased font-sans">{children}</body>
    </html>
  );
}
