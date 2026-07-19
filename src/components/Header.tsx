"use client";

import { useState, useEffect } from "react";
import { Menu, X, LogIn } from "lucide-react";
import { useAuth } from "./AuthProvider";
import AuthModal from "./AuthModal";
import UserMenu from "./UserMenu";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/#features", label: "Features" },
  { href: "/#how-to", label: "How to Use" },
  { href: "/#faq", label: "FAQ" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (window.location.search.includes("signin=true")) {
      setAuthOpen(true);
    }
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <a href="/" className="flex items-center gap-2" aria-label="YouTube Transcripts Home">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white text-sm font-bold">
              YT
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">
              YouTube <span className="text-primary">Transcripts</span>
            </span>
          </a>

          <nav className="hidden items-center gap-6 md:flex" aria-label="Main navigation">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
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
          </nav>

          <div className="flex items-center gap-2 md:hidden">
            {user ? <UserMenu /> : null}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex items-center justify-center rounded-md p-2 text-muted hover:bg-surface"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="border-t border-border md:hidden">
            <nav className="flex flex-col gap-1 px-4 py-3" aria-label="Mobile navigation">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-md px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-surface hover:text-foreground"
                >
                  {link.label}
                </a>
              ))}
              {!user && (
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    setAuthOpen(true);
                  }}
                  className="mt-1 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
                >
                  Sign In
                </button>
              )}
            </nav>
          </div>
        )}
      </header>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
