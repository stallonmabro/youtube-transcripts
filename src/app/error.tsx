"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <>
      <Header />
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 mb-6">
            <AlertTriangle size={32} className="text-red-500" />
          </div>
          <h1 className="text-4xl font-bold text-foreground">Something went wrong</h1>
          <p className="mt-3 text-muted leading-relaxed">
            An unexpected error occurred. Please try again or come back later.
          </p>
          {error.digest && (
            <p className="mt-2 text-xs text-muted/50">
              Error ID: {error.digest}
            </p>
          )}
          <button
            onClick={reset}
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            <RefreshCw size={16} />
            Try Again
          </button>
        </div>
      </main>
      <Footer />
    </>
  );
}
