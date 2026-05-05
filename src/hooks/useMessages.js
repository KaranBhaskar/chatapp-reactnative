import { useEffect, useState } from "react";

import { sendMediaMessage, sendTextMessage, subscribeToMessages } from "../firebase/firestore";
import { uploadChatMedia } from "../firebase/media";
import { useAuthUser } from "./useAuthUser";

export function useMessages(chatId) {
  const { firebaseReady, formatAuthError, user } = useAuthUser();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(Boolean(firebaseReady && user && chatId));
  const [messages, setMessages] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
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
      return false;
    }

    setSending(true);
    setError("");

    try {
      await sendTextMessage({ chatId, currentUser: user, text });
      return true;
    } catch (nextError) {
      setError(formatAuthError(nextError));
      return false;
    } finally {
      setSending(false);
    }
  }

  async function sendMedia(media, caption = "") {
    if (!user || !chatId || !media) {
      return false;
    }

    setUploading(true);
    setUploadProgress(0);
    setError("");

    try {
      const attachment = await uploadChatMedia({
        chatId,
        media,
        onProgress: setUploadProgress,
      });

      await sendMediaMessage({ attachment, caption, chatId, currentUser: user });
      setUploadProgress(1);
      return true;
    } catch (nextError) {
      setError(formatAuthError(nextError));
      return false;
    } finally {
      setUploading(false);
    }
  }

  return { error, loading, messages, sendMedia, sendMessage, sending, uploadProgress, uploading };
}
