"use client";

import { useEffect, useState, useTransition } from "react";
import { authClient } from "@/lib/auth-client";

const defaultErrorMessage = "Unable to sign in with those credentials.";

export const AdminLoginForm = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setIsReady(true);
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(() => {
      void submitCredentials(formData);
    });
  };

  const submitCredentials = async (formData: FormData) => {
    setErrorMessage(null);

    const response = await authClient.signIn.email({
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
      callbackURL: "/admin",
      rememberMe: true,
    });

    if (response.error) {
      setErrorMessage(response.error.message ?? defaultErrorMessage);
      return;
    }

    window.location.assign("/admin");
  };

  return (
    <form className="space-y-5" method="post" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label className="text-sm font-medium text-[var(--muted-strong)]" htmlFor="email">
          Email
        </label>
        <input
          required
          autoComplete="email"
          className="w-full rounded-2xl border border-[var(--line-strong)] bg-black/20 px-4 py-3 text-base text-[var(--foreground)] outline-none transition focus:border-[var(--accent-cyan)]"
          id="email"
          name="email"
          type="email"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-[var(--muted-strong)]" htmlFor="password">
          Password
        </label>
        <input
          required
          autoComplete="current-password"
          className="w-full rounded-2xl border border-[var(--line-strong)] bg-black/20 px-4 py-3 text-base text-[var(--foreground)] outline-none transition focus:border-[var(--accent-cyan)]"
          id="password"
          name="password"
          type="password"
        />
      </div>
      {errorMessage ? (
        <p className="rounded-2xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
          {errorMessage}
        </p>
      ) : null}
      <button
        className="inline-flex w-full items-center justify-center rounded-full bg-[var(--accent-cyan)] px-5 py-3 text-sm font-semibold uppercase tracking-[0.24em] text-slate-950 transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
        disabled={!isReady || isPending}
        type="submit"
      >
        {!isReady ? "Preparing..." : isPending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
};
