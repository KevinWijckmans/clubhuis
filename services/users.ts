import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, type DocumentData } from "firebase/firestore";

export type AppUser = {
  uid: string;
  displayName?: string | null;
  email?: string | null;
  photoURL?: string | null;
  createdAt?: unknown;
};

export const getUserDoc = async (uid: string) => {
  const snapshot = await getDoc(doc(db, "users", uid));
  return snapshot.exists() ? (snapshot.data() as AppUser) : null;
};

export const saveUserProfile = async (user: AppUser) => {
  await setDoc(
    doc(db, "users", user.uid),
    {
      uid: user.uid,
      displayName: user.displayName ?? null,
      email: user.email ?? null,
      photoURL: user.photoURL ?? null,
      createdAt: user.createdAt ?? new Date(),
    },
    { merge: true }
  );
};

export const getUserName = async (uid: string) => {
  const user = await getUserDoc(uid);
  return user?.displayName ?? "Friend";
};
