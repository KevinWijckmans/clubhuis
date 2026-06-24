"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { createPost, listenToPosts, type Post } from "@/services/posts";
import { getUserName } from "@/services/users";

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = listenToPosts(async (nextPosts) => {
      const postsWithNames = await Promise.all(
        nextPosts.map(async (post) => ({
          ...post,
          userName: await getUserName(post.userId),
        }))
      );
      setPosts(postsWithNames);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const currentUser = auth.currentUser;
    if (!currentUser || !draft.trim()) return;

    await createPost(draft, currentUser.uid);
    setDraft("");
  };

  const formatTime = (value: unknown) => {
    if (!value) return "just now";
    if (typeof value === "string") return value;
    if (typeof value === "object" && "toDate" in value) {
      return (value as { toDate: () => Date }).toDate().toLocaleString();
    }
    return "recently";
  };

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-sm">
        <h2 className="text-lg font-semibold">Share the vibe</h2>
        <p className="mt-1 text-sm text-slate-400">Drop a quick update for the group.</p>
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            rows={3}
            placeholder="What’s happening tonight?"
            className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 outline-none ring-0"
          />
          <button
            type="submit"
            className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-emerald-400"
          >
            Publish
          </button>
        </form>
      </section>

      <section className="space-y-3">
        {loading ? (
          <p className="text-sm text-slate-400">Loading feed…</p>
        ) : posts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 p-6 text-center text-sm text-slate-400">
            The feed is empty. Be the first to post.
          </div>
        ) : (
          posts.map((post) => (
            <article key={post.id} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-slate-100">{post.userName ?? "Friend"}</p>
                  <p className="text-xs text-slate-400">{formatTime(post.createdAt)}</p>
                </div>
                <span className="rounded-full bg-slate-800 px-2.5 py-1 text-xs text-slate-300">
                  {post.likes?.length ?? 0} likes
                </span>
              </div>
              <p className="mt-3 whitespace-pre-line text-sm text-slate-300">{post.text}</p>
            </article>
          ))
        )}
      </section>
    </div>
  );
}
