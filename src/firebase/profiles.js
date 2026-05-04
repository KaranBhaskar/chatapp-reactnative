import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

import { FIREBASE_PATHS } from "../constants/firebasePaths";
import { db } from "./config";
import { assertFirebaseReady } from "./status";

export async function createUserProfile({ user, displayName }) {
  assertFirebaseReady();

  const userRef = doc(db, FIREBASE_PATHS.users, user.uid);
  const existingProfile = await getDoc(userRef);

  if (existingProfile.exists()) {
    return;
  }

  await setDoc(userRef, {
    uid: user.uid,
    displayName: displayName || user.displayName || "",
    email: user.email || "",
    photoURL: user.photoURL || null,
    createdAt: serverTimestamp(),
    lastSeenAt: serverTimestamp(),
  });
}
