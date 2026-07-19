"use client";

import { useEffect, useState } from "react";
import { LogIn } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import AuthModal from "@/components/AuthModal";
import UserMenu from "@/components/UserMenu";

export default function WatchPageHeader() {
  const { user } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    if (window.location.search.includes("signin=true")) {
      setAuthOpen(true);
    }
  }, []);

  return (
    <>
      <header className="border-b border-border bg-white">
        <div className="mx-auto flex h-14 items-center justify-between px-4 sm:px-6 max-w-6xl">
          <a href="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-white text-xs font-bold">
              YT
            </div>
            <span className="text-base font-bold tracking-tight text-foreground">
              YouTube <span className="text-primary">Transcripts</span>
            </span>
          </a>

          {user ? (
            <UserMenu />
          ) : (
            <button
              onClick={() => setAuthOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
            >
              <LogIn size={14} />
              Sign In
            </button>
          )}
        </div>
      </header>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
