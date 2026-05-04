import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { Platform } from "react-native";

import { auth } from "./config";
import { createUserProfile } from "./profiles";
import { assertFirebaseReady } from "./status";

export function listenToAuthState(callback) {
  if (!auth) {
    callback(null);
    return () => {};
  }

  return onAuthStateChanged(auth, callback);
}

export async function signUpWithEmail({ displayName, email, password }) {
  assertFirebaseReady();

  const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
  const cleanDisplayName = displayName.trim();

  if (cleanDisplayName) {
    await updateProfile(credential.user, { displayName: cleanDisplayName });
  }

  await createUserProfile({
    user: credential.user,
    displayName: cleanDisplayName,
  });

  return credential.user;
}

export async function signInWithEmail({ email, password }) {
  assertFirebaseReady();

  const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
  return credential.user;
}

export async function signInWithGoogle() {
  assertFirebaseReady();

  if (Platform.OS !== "web") {
    throw new Error("Google sign-in on native needs Expo AuthSession/client IDs. Web popup is wired first.");
  }

  const provider = new GoogleAuthProvider();
  const credential = await signInWithPopup(auth, provider);
  await createUserProfile({ user: credential.user, displayName: credential.user.displayName || "" });
  return credential.user;
}

export async function signOutUser() {
  assertFirebaseReady();
  await signOut(auth);
}
