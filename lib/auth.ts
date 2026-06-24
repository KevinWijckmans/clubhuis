import { auth, provider } from "./firebase";
import { signInWithPopup } from "firebase/auth";

export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, provider);
  return result.user;
};
