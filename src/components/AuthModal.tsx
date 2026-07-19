"use client";

import { useState } from "react";
import { X, Loader2, Mail } from "lucide-react";
import { useAuth } from "./AuthProvider";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

type AuthMode = "signin" | "signup";

export default function AuthModal({ open, onClose }: AuthModalProps) {
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const err =
      mode === "signin"
        ? await signIn(email, password)
        : await signUp(email, password);

    if (err) {
      setError(err);
      setLoading(false);
    } else if (mode === "signup") {
      setMode("signin");
      setError("Check your email to confirm your account, then sign in.");
      setLoading(false);
    }
  }

  function switchMode() {
    setMode(mode === "signin" ? "signup" : "signin");
    setError("");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="relative w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-muted transition-colors hover:text-foreground"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <h3 className="text-lg font-semibold text-foreground">
          {mode === "signin" ? "Sign In" : "Create Account"}
        </h3>
        <p className="mt-1 text-sm text-muted">
          {mode === "signin"
            ? "Sign in to save and manage your transcripts."
            : "Create an account to save your transcript history."}
        </p>

        {error && (
          <p
            className={`mt-3 text-sm ${
              error.startsWith("Check") ? "text-amber-600" : "text-red-500"
            }`}
          >
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            required
            className="w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-foreground placeholder:text-muted/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            minLength={6}
            className="w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-foreground placeholder:text-muted/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            <Mail size={16} />
            {mode === "signin" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div className="my-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted/60">or</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <button
          onClick={signInWithGoogle}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        <p className="mt-4 text-center text-sm text-muted">
          {mode === "signin" ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={switchMode}
            className="font-medium text-primary hover:underline"
          >
            {mode === "signin" ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}
