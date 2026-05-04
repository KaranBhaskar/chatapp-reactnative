import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { clearLocalPrivateCache } from "../cache/clearLocalPrivateCache";
import { listenToAuthState, signOutUser } from "../firebase/auth";
import { isFirebaseConfigured, missingFirebaseConfigKeys } from "../firebase/env";
import { formatAuthError } from "../firebase/status";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const unsubscribe = listenToAuthState((nextUser) => {
      setUser(nextUser);
      setAuthChecked(true);
    });

    return unsubscribe;
  }, []);

  async function signOutAndClearCache() {
    await clearLocalPrivateCache();
    await signOutUser();
    setUser(null);
  }

  const value = useMemo(
    () => ({
      authChecked,
      firebaseReady: isFirebaseConfigured,
      firebaseMissingKeys: missingFirebaseConfigKeys,
      formatAuthError,
      signOutAndClearCache,
      user,
    }),
    [authChecked, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used inside AuthProvider");
  }

  return context;
}
