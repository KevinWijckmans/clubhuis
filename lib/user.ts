import { db } from "./firebase";
import { doc, setDoc } from "firebase/firestore";

export const createUserIfNotExists = async (user: any) => {
  if (!user) return;

  await setDoc(
    doc(db, "users", user.uid),
    {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      createdAt: new Date(),
    },
    { merge: true }
  );
};
