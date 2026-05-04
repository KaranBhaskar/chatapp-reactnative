import { useEffect, useMemo, useState } from "react";

import { subscribeToUserChats } from "../firebase/firestore";
import { useAuthUser } from "./useAuthUser";

function initialForName(name) {
  return (name || "U")
    .split(/[ @._-]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function toUiChat(chat, currentUserUid) {
  const otherMemberId = chat.memberIds?.find((memberId) => memberId !== currentUserUid);
  const otherMember = chat.memberSummary?.[otherMemberId] || {};
  const name = otherMember.displayName || "Unknown user";

  return {
    ...chat,
    initials: initialForName(name),
    name,
    preview: chat.lastMessageText || "No messages yet",
    time: chat.lastMessageText ? "Live" : "",
  };
}

export function useChats() {
  const { firebaseReady, formatAuthError, user } = useAuthUser();
  const [chats, setChats] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(Boolean(firebaseReady && user));

  useEffect(() => {
    if (!firebaseReady || !user) {
      setChats([]);
      setLoading(false);
      return undefined;
    }

    setLoading(true);
    setError("");

    const unsubscribe = subscribeToUserChats({
      currentUserUid: user.uid,
      onError: (nextError) => {
        setError(formatAuthError(nextError));
        setLoading(false);
      },
      onNext: (nextChats) => {
        setChats(nextChats);
        setLoading(false);
      },
    });

    return unsubscribe;
  }, [firebaseReady, formatAuthError, user]);

  const uiChats = useMemo(() => chats.map((chat) => toUiChat(chat, user?.uid)), [chats, user]);

  return { chats: uiChats, error, loading };
}
