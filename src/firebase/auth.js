import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { ref, set } from "firebase/database";
import { auth, db } from "./config";

const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, provider);
  const user = result.user;
  // Save user profile to DB
  await set(ref(db, `users/${user.uid}`), {
    uid:       user.uid,
    name:      user.displayName,
    email:     user.email,
    photo:     user.photoURL,
    lastSeen:  Date.now(),
  });
  return user;
};

export const logOut = () => signOut(auth);