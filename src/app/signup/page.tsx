"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      setLoading(false);
      setError(json.error || "Signup failed");
      return;
    }

    const login = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (login?.error) {
      setError("Account created — please sign in");
      router.push("/login");
      return;
    }
    router.push("/setup");
    router.refresh();
  }

  return (
    <div className="min-h-screen px-4 py-16">
      <div className="mx-auto max-w-md rounded-2xl border border-line bg-paper p-8 shadow-sm">
        <Link
          href="/"
          className="font-[family-name:var(--font-display)] text-2xl font-semibold"
        >
          BillFora
        </Link>
        <h1 className="mt-6 font-[family-name:var(--font-display)] text-3xl">
          Create account
        </h1>
        <p className="mt-2 text-sm text-ink-muted">
          Free plan: 15 invoices / month. Upgrade anytime.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div className="field">
            <label htmlFor="name">Your name</label>
            <input
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>
          <div className="field">
            <label htmlFor="password">Password (min 6)</label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>
          {error ? <p className="text-sm text-red-700">{error}</p> : null}
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading}
          >
            {loading ? "Creating…" : "Sign up free"}
          </button>
        </form>

        <p className="mt-6 text-sm text-ink-muted">
          Already have an account?{" "}
          <Link href="/login" className="text-teal underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
