"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { createUserIfNotExists } from "@/lib/user";

const tabs = [
  { href: "/home", label: "Home" },
  { href: "/events", label: "Events" },
  { href: "/profile", label: "Profile" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        await createUserIfNotExists(firebaseUser);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-300">
        <p>Loading Clubhuis…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
        <div className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900/80 p-6 text-center shadow-xl">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-emerald-400">Clubhuis</p>
          <h1 className="mt-3 text-2xl font-semibold">Private hangouts, shared in one place.</h1>
          <p className="mt-3 text-sm text-slate-400">
            Sign in with Google to join the feed, create posts, and keep track of your club life.
          </p>
          <div className="mt-6">
            <Link
              href="/login"
              className="inline-flex w-full items-center justify-center rounded-xl bg-emerald-500 px-4 py-3 font-medium text-slate-950 transition hover:bg-emerald-400"
            >
              Continue with Google
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-4 sm:px-6 lg:px-8">
        <header className="mb-4 rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-emerald-400">Clubhuis</p>
              <p className="text-xs text-slate-400">Your private friend circle</p>
            </div>
            <button
              onClick={() => signOut(auth)}
              className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 transition hover:border-slate-500"
            >
              Sign out
            </button>
          </div>
        </header>

        <nav className="mb-4 flex gap-2 rounded-2xl border border-slate-800 bg-slate-900/70 p-2">
          {tabs.map((tab) => {
            const active = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex-1 rounded-xl px-3 py-2 text-center text-sm font-medium transition ${
                  active ? "bg-emerald-500 text-slate-950" : "text-slate-300 hover:bg-slate-800"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
