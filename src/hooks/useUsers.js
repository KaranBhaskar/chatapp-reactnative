import { useEffect, useState } from "react";

import { subscribeToUsers } from "../firebase/firestore";
import { useAuthUser } from "./useAuthUser";

export function useUsers() {
  const { firebaseReady, formatAuthError, user } = useAuthUser();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(Boolean(firebaseReady && user));
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!firebaseReady || !user) {
      setLoading(false);
      setUsers([]);
      return undefined;
    }

    setLoading(true);
    setError("");

    const unsubscribe = subscribeToUsers({
      currentUserUid: user.uid,
      onError: (nextError) => {
        setError(formatAuthError(nextError));
        setLoading(false);
      },
      onNext: (nextUsers) => {
        setUsers(nextUsers);
        setLoading(false);
      },
    });

    return unsubscribe;
  }, [firebaseReady, formatAuthError, user]);

  return { error, loading, users };
}
