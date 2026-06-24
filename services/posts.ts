import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  type FirestoreError,
} from "firebase/firestore";

export type Post = {
  id: string;
  userId: string;
  text: string;
  imageUrl?: string;
  createdAt?: unknown;
  likes?: string[];
  userName?: string;
};

export const postsCollection = collection(db, "posts");

export const createPost = async (text: string, userId: string) => {
  if (!text.trim()) return;

  await addDoc(postsCollection, {
    userId,
    text: text.trim(),
    createdAt: serverTimestamp(),
    likes: [],
  });
};

export const listenToPosts = (
  callback: (posts: Post[]) => void,
  onError?: (error: FirestoreError) => void
) => {
  const q = query(postsCollection, orderBy("createdAt", "desc"));

  return onSnapshot(
    q,
    (snapshot) => {
      const posts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Post, "id">),
      }));
      callback(posts);
    },
    (error) => {
      onError?.(error);
    }
  );
};
