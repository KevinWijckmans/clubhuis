"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { getUserDoc } from "@/services/users";

export default function ProfilePage() {
  const [profile, setProfile] = useState<{ displayName?: string | null; email?: string | null; photoURL?: string | null } | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      const user = await getUserDoc(currentUser.uid);
      setProfile(user);
    };

    loadProfile();
  }, []);

  if (!profile) {
    return <p className="text-sm text-slate-400">Loading profile…</p>;
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-sm">
      <div className="flex items-center gap-3">
        {profile.photoURL ? (
          <img src={profile.photoURL} alt="Profile" className="h-12 w-12 rounded-full" />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-lg font-semibold text-emerald-400">
            {profile.displayName?.[0] ?? "U"}
          </div>
        )}
        <div>
          <h2 className="text-lg font-semibold text-slate-100">{profile.displayName ?? "Friend"}</h2>
          <p className="text-sm text-slate-400">{profile.email ?? "No email available"}</p>
        </div>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Status</p>
          <p className="mt-1 text-sm text-slate-300">Ready for the next hangout</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Club role</p>
          <p className="mt-1 text-sm text-slate-300">Member</p>
        </div>
      </div>
    </div>
  );
}
