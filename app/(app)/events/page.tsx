"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { createEvent, listenToEvents, type EventItem } from "@/services/events";

export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const unsubscribe = listenToEvents((nextEvents) => setEvents(nextEvents));
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const currentUser = auth.currentUser;
    if (!currentUser || !title.trim()) return;

    await createEvent({
      title: title.trim(),
      description: description.trim(),
      date,
      createdBy: currentUser.uid,
      participants: [currentUser.uid],
    });

    setTitle("");
    setDescription("");
    setDate("");
  };

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-sm">
        <h2 className="text-lg font-semibold">Plan something</h2>
        <p className="mt-1 text-sm text-slate-400">Create a quick event for the club.</p>
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Event title"
            className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 outline-none"
          />
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={3}
            placeholder="Details"
            className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 outline-none"
          />
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 outline-none"
          />
          <button
            type="submit"
            className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-emerald-400"
          >
            Save event
          </button>
        </form>
      </section>

      <section className="space-y-3">
        {events.map((event) => (
          <article key={event.id} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-semibold text-slate-100">{event.title}</h3>
              <span className="text-xs text-slate-400">{event.participants?.length ?? 0} going</span>
            </div>
            {event.description ? <p className="mt-2 text-sm text-slate-400">{event.description}</p> : null}
            {event.date ? <p className="mt-2 text-xs text-emerald-400">{event.date}</p> : null}
          </article>
        ))}
      </section>
    </div>
  );
}
