import { db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";

export type EventItem = {
  id: string;
  title: string;
  description?: string;
  date?: string;
  createdBy?: string;
  participants?: string[];
  createdAt?: unknown;
};

const eventsCollection = collection(db, "events");

export const createEvent = async (payload: Omit<EventItem, "id" | "createdAt">) => {
  await addDoc(eventsCollection, {
    ...payload,
    participants: payload.participants ?? [],
    createdAt: serverTimestamp(),
  });
};

export const listenToEvents = (callback: (events: EventItem[]) => void) => {
  const q = query(eventsCollection, orderBy("createdAt", "desc"));

  return onSnapshot(q, (snapshot) => {
    const events = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<EventItem, "id">),
    }));
    callback(events);
  });
};
