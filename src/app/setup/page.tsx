"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { COUNTRIES, getCountry, type CountryCode } from "@/lib/countries";
import { saveBusiness, useAppData } from "@/lib/store";
import type { BusinessProfile } from "@/lib/types";

const EMPTY: BusinessProfile = {
  name: "",
  email: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  countryCode: "IN",
  taxId: "",
  defaultTaxRate: 18,
};

export default function SetupPage() {
  const data = useAppData();
  const router = useRouter();
  const [form, setForm] = useState<BusinessProfile>(EMPTY);
  const [hydrated, setHydrated] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (data.business) {
      setForm(data.business);
    }
    setHydrated(true);
  }, [data.business]);

  const pack = getCountry(form.countryCode);

  function setField<K extends keyof BusinessProfile>(
    key: K,
    value: BusinessProfile[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  function onCountryChange(code: CountryCode) {
    const next = getCountry(code);
    setForm((prev) => ({
      ...prev,
      countryCode: code,
      defaultTaxRate: next.defaultTaxRate,
    }));
    setSaved(false);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    saveBusiness({
      ...form,
      name: form.name.trim(),
      defaultTaxRate: Number(form.defaultTaxRate) || 0,
    });
    setSaved(true);
    router.push("/dashboard");
  }

  if (!hydrated) {
    return (
      <AppShell title="Business setup">
        <p className="text-ink-muted">Loading…</p>
      </AppShell>
    );
  }

  return (
    <AppShell title="Business setup">
      <form onSubmit={onSubmit} className="max-w-2xl space-y-8">
        <div className="panel space-y-5">
          <div className="field">
            <label htmlFor="country">Country</label>
            <select
              id="country"
              value={form.countryCode}
              onChange={(e) => onCountryChange(e.target.value as CountryCode)}
            >
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name} ({c.code})
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-md bg-teal-soft/60 border border-teal/20 px-4 py-3 text-sm space-y-1">
            <p>
              <span className="text-ink-muted">Tax ID label: </span>
              <strong>{pack.taxIdLabel}</strong>
            </p>
            <p>
              <span className="text-ink-muted">Currency: </span>
              <strong>
                {pack.currency} ({pack.currencySymbol})
              </strong>
            </p>
            <p>
              <span className="text-ink-muted">Invoice title: </span>
              <strong>{pack.invoiceTitle}</strong>
            </p>
            <p>
              <span className="text-ink-muted">Default tax rate: </span>
              <strong>{pack.defaultTaxRate}%</strong>
              <span className="text-ink-muted"> · {pack.taxLabel}</span>
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="field sm:col-span-2">
              <label htmlFor="name">Business name</label>
              <input
                id="name"
                required
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                placeholder="Acme Studio"
              />
            </div>
            <div className="field">
              <label htmlFor="taxId">{pack.taxIdLabel}</label>
              <input
                id="taxId"
                value={form.taxId}
                onChange={(e) => setField("taxId", e.target.value)}
                placeholder={pack.taxIdLabel}
              />
            </div>
            <div className="field">
              <label htmlFor="defaultTaxRate">
                Default {pack.taxLabel} rate (%)
              </label>
              <input
                id="defaultTaxRate"
                type="number"
                min={0}
                step={0.01}
                value={form.defaultTaxRate}
                onChange={(e) =>
                  setField("defaultTaxRate", Number(e.target.value))
                }
              />
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setField("email", e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="phone">Phone</label>
              <input
                id="phone"
                value={form.phone}
                onChange={(e) => setField("phone", e.target.value)}
              />
            </div>
            <div className="field sm:col-span-2">
              <label htmlFor="addressLine1">Address line 1</label>
              <input
                id="addressLine1"
                value={form.addressLine1}
                onChange={(e) => setField("addressLine1", e.target.value)}
              />
            </div>
            <div className="field sm:col-span-2">
              <label htmlFor="addressLine2">Address line 2</label>
              <input
                id="addressLine2"
                value={form.addressLine2}
                onChange={(e) => setField("addressLine2", e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="city">City</label>
              <input
                id="city"
                value={form.city}
                onChange={(e) => setField("city", e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="state">State / province</label>
              <input
                id="state"
                value={form.state}
                onChange={(e) => setField("state", e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="postalCode">Postal code</label>
              <input
                id="postalCode"
                value={form.postalCode}
                onChange={(e) => setField("postalCode", e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button type="submit" className="btn btn-primary">
            Save business profile
          </button>
          {saved ? (
            <span className="text-sm text-teal">Saved</span>
          ) : null}
        </div>
      </form>
    </AppShell>
  );
}
