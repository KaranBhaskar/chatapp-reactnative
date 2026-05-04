import { useEffect, useState } from "react";

import { sendTextMessage, subscribeToMessages } from "../firebase/firestore";
import { useAuthUser } from "./useAuthUser";

export function useMessages(chatId) {
  const { firebaseReady, formatAuthError, user } = useAuthUser();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(Boolean(firebaseReady && user && chatId));
  const [messages, setMessages] = useState([]);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!firebaseReady || !user || !chatId) {
      setLoading(false);
      setMessages([]);
      return undefined;
    }

    setLoading(true);
    setError("");

    const unsubscribe = subscribeToMessages({
      chatId,
      onError: (nextError) => {
        setError(formatAuthError(nextError));
        setLoading(false);
      },
      onNext: (nextMessages) => {
        setMessages(nextMessages);
        setLoading(false);
      },
    });

    return unsubscribe;
  }, [chatId, firebaseReady, formatAuthError, user]);

  async function sendMessage(text) {
    if (!user || !chatId) {
      return;
    }

    setSending(true);
    setError("");

    try {
      await sendTextMessage({ chatId, currentUser: user, text });
    } catch (nextError) {
      setError(formatAuthError(nextError));
    } finally {
      setSending(false);
    }
  }

  return { error, loading, messages, sendMessage, sending };
}
