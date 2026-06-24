"use client";

import { useRouter } from "next/navigation";
import { signInWithGoogle } from "@/lib/auth";
import { createUserIfNotExists } from "@/lib/user";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const user = await signInWithGoogle();
      await createUserIfNotExists(user);
      router.push("/home");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900/80 p-6 text-center shadow-xl">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-emerald-400">Clubhuis</p>
        <h1 className="mt-3 text-2xl font-semibold">Welcome back</h1>
        <p className="mt-3 text-sm text-slate-400">Sign in to access your private club feed.</p>
        <button
          onClick={handleLogin}
          className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-emerald-500 px-4 py-3 font-medium text-slate-950 transition hover:bg-emerald-400"
        >
          Continue with Google
        </button>
      </div>
    </main>
  );
}
