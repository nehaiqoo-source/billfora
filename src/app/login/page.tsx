"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError("Wrong email or password");
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-4">
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
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
      </div>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <button type="submit" className="btn btn-primary w-full" disabled={loading}>
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

export default function LoginPage() {
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
          Sign in
        </h1>
        <p className="mt-2 text-sm text-ink-muted">
          Same account works on web and (soon) desktop.
        </p>
        <Suspense fallback={<p className="mt-8 text-ink-muted">Loading…</p>}>
          <LoginForm />
        </Suspense>
        <p className="mt-6 text-sm text-ink-muted">
          New here?{" "}
          <Link href="/signup" className="text-teal underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
