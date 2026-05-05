import { isFirebaseConfigured } from "./env";

export function assertFirebaseReady() {
  if (!isFirebaseConfigured) {
    throw new Error("Service is unavailable. Try again soon.");
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

  if (code === "permission-denied") {
    return "We couldn't complete that action. Please try again.";
  }

  if (code === "functions/internal") {
    return "We couldn't reach the service. Please try again.";
  }

  return error?.message || "Something went wrong. Try again.";
}
