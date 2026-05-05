import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getApps, initializeApp } from "firebase/app";
import { getAuth, getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

import { firebaseConfig, isFirebaseConfigured } from "./env";

const app = isFirebaseConfigured
  ? getApps().length > 0
    ? getApps()[0]
    : initializeApp(firebaseConfig)
  : null;

function createNativeAuth(firebaseApp) {
  if (!firebaseApp) {
    return null;
  }

  try {
    return initializeAuth(firebaseApp, {
      persistence: getReactNativePersistence(ReactNativeAsyncStorage),
    });
  } catch (error) {
    if (error?.code === "auth/already-initialized") {
      return getAuth(firebaseApp);
    }

    throw error;
  }
}

export const firebaseApp = app;
export const auth = createNativeAuth(app);
export const db = app ? getFirestore(app) : null;
export const storage = app ? getStorage(app) : null;
