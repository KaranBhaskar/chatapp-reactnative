const { initializeApp } = require("firebase-admin/app");
const { HttpsError, onCall } = require("firebase-functions/v2/https");

initializeApp();

exports.healthCheck = onCall({ region: "us-central1" }, (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Sign in before calling this function.");
  }

  return {
    message: "Backend is reachable.",
    ok: true,
  };
});
