"use client";

import { useState, useRef, useEffect } from "react";
import { User, LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "./AuthProvider";

export default function UserMenu() {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (!user) return null;

  const name =
    user.user_metadata?.full_name || user.email?.split("@")[0] || "User";
  const avatar = user.user_metadata?.avatar_url;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-lg border border-border px-2.5 py-1.5 text-sm text-muted transition-colors hover:text-foreground"
      >
        {avatar ? (
          <img
            src={avatar}
            alt=""
            className="h-6 w-6 rounded-full object-cover"
          />
        ) : (
          <User size={16} />
        )}
        <span className="hidden sm:inline max-w-[120px] truncate">{name}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-30 mt-1 w-48 rounded-lg border border-border bg-card py-1 shadow-lg">
          <a
            href="/dashboard"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-muted transition-colors hover:bg-surface hover:text-foreground"
          >
            <LayoutDashboard size={14} />
            Dashboard
          </a>
          <button
            onClick={() => {
              setOpen(false);
              signOut();
            }}
            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-muted transition-colors hover:bg-surface hover:text-foreground"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
