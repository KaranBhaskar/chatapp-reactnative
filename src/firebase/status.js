import { isFirebaseConfigured, missingFirebaseConfigKeys } from "./env";

export function assertFirebaseReady() {
  if (!isFirebaseConfigured) {
    throw new Error(`Firebase config is missing: ${missingFirebaseConfigKeys.join(", ")}`);
  }
}

export function formatAuthError(error) {
  const code = error?.code || "";

  if (code === "auth/invalid-email") {
    return "Use a valid email address.";
  }

  if (code === "auth/invalid-credential" || code === "auth/wrong-password") {
    return "The email or password is incorrect.";
  }

  if (code === "auth/email-already-in-use") {
    return "That email already has an account.";
  }

  if (code === "auth/weak-password") {
    return "Use a stronger password with at least 6 characters.";
  }

  if (code === "auth/popup-closed-by-user") {
    return "Google sign-in was closed before it finished.";
  }

  return error?.message || "Something went wrong. Try again.";
}
