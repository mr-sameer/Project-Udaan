"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Bell } from "lucide-react";
import { logoutAction } from "@/lib/auth/actions";

const NAV_LINKS = [
  { label: "Why Udaan Exists", href: "/why-udaan" },
  { label: "Our Work", href: "/projects" },
  { label: "Impact", href: "/impact" },
  { label: "Stories", href: "/stories" },
  { label: "About", href: "/about" },
];

export function NavClient({
  isAuthenticated,
  isAdmin,
  unreadCount,
  fullName,
}: {
  isAuthenticated: boolean;
  isAdmin: boolean;
  unreadCount: number;
  fullName?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-parchment/95 border-b border-sandstone">
      <div className="max-w-6xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-indigo">
            <span className="font-display text-parchment text-[15px]">उ</span>
          </div>
          <span className="font-display text-indigo text-[19px]">Project Udaan</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-semibold text-ink-soft hover:opacity-70 transition-opacity"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              {isAdmin && (
                <Link href="/admin" className="text-sm font-bold text-indigo">
                  Admin
                </Link>
              )}
              <Link href="/dashboard/notifications" className="relative p-2" aria-label="Notifications">
                <Bell size={18} className="text-indigo" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-kesari text-[9px] font-bold text-parchment">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Link>
              <Link
                href="/dashboard"
                className="text-sm font-semibold text-ink-soft hover:opacity-70"
              >
                {fullName ?? "Dashboard"}
              </Link>
              <form action={logoutAction}>
                <button type="submit" className="text-sm font-semibold text-ink-soft hover:opacity-70">
                  Log out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/volunteer/apply" className="text-sm font-semibold text-ink-soft hover:opacity-70">
                Give Your Time
              </Link>
              <Link
                href="/donate"
                className="px-5 py-2.5 rounded-full text-sm font-bold bg-kesari text-parchment transition-transform hover:scale-[1.03]"
              >
                Support an Opportunity
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu" aria-expanded={open}>
          {open ? <X size={22} className="text-indigo" /> : <Menu size={22} className="text-indigo" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden px-5 pb-5 flex flex-col gap-4 bg-parchment">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm font-semibold text-ink-soft" onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          {isAuthenticated ? (
            <>
              {isAdmin && (
                <Link href="/admin" className="text-sm font-bold text-indigo">
                  Admin
                </Link>
              )}
              <Link href="/dashboard" className="text-sm font-semibold text-ink-soft">
                Dashboard
              </Link>
              <form action={logoutAction}>
                <button type="submit" className="text-sm font-semibold text-ink-soft text-left">
                  Log out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-semibold text-ink-soft">
                Log in
              </Link>
              <Link
                href="/donate"
                className="px-5 py-3 rounded-full text-sm font-bold bg-kesari text-parchment text-center"
              >
                Support an Opportunity
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
