import {
  collection,
  doc,
  getDoc,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
  writeBatch,
} from "firebase/firestore";

import { FIREBASE_PATHS } from "../constants/firebasePaths";
import { db } from "./config";
import { assertFirebaseReady } from "./status";

export function directChatIdForUsers(firstUid, secondUid) {
  return `dm_${[firstUid, secondUid].sort().join("_")}`;
}

export function subscribeToUsers({ currentUserUid, onError, onNext }) {
  assertFirebaseReady();

  const usersQuery = query(collection(db, FIREBASE_PATHS.users), orderBy("displayName", "asc"), limit(50));

  return onSnapshot(
    usersQuery,
    (snapshot) => {
      const users = snapshot.docs
        .map((userDoc) => ({ id: userDoc.id, ...userDoc.data() }))
        .filter((user) => user.uid !== currentUserUid);

      onNext(users);
    },
    onError,
  );
}

export function subscribeToUserChats({ currentUserUid, onError, onNext }) {
  assertFirebaseReady();

  const chatsQuery = query(
    collection(db, FIREBASE_PATHS.chats),
    where("memberIds", "array-contains", currentUserUid),
    orderBy("updatedAt", "desc"),
    limit(50),
  );

  return onSnapshot(
    chatsQuery,
    (snapshot) => {
      const chats = snapshot.docs.map((chatDoc) => ({
        id: chatDoc.id,
        ...chatDoc.data(),
      }));

      onNext(chats);
    },
    onError,
  );
}

export function subscribeToMessages({ chatId, onError, onNext }) {
  assertFirebaseReady();

  const messagesQuery = query(
    collection(db, FIREBASE_PATHS.chats, chatId, FIREBASE_PATHS.messages),
    orderBy("createdAt", "asc"),
    limit(100),
  );

  return onSnapshot(
    messagesQuery,
    (snapshot) => {
      const messages = snapshot.docs.map((messageDoc) => ({
        id: messageDoc.id,
        ...messageDoc.data(),
      }));

      onNext(messages);
    },
    onError,
  );
}

export async function createOrOpenDirectChat({ currentUser, otherUser }) {
  assertFirebaseReady();

  const chatId = directChatIdForUsers(currentUser.uid, otherUser.uid);
  const chatRef = doc(db, FIREBASE_PATHS.chats, chatId);
  const chatSnapshot = await getDoc(chatRef);

  if (!chatSnapshot.exists()) {
    await setDoc(chatRef, {
      type: "direct",
      memberIds: [currentUser.uid, otherUser.uid].sort(),
      memberSummary: {
        [currentUser.uid]: {
          displayName: currentUser.displayName || currentUser.email || "You",
          photoURL: currentUser.photoURL || null,
        },
        [otherUser.uid]: {
          displayName: otherUser.displayName || otherUser.email || "User",
          photoURL: otherUser.photoURL || null,
        },
      },
      createdBy: currentUser.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastMessageText: "",
      lastMessageAt: null,
      lastMessageSenderId: "",
    });
  }

  return chatId;
}

export async function sendTextMessage({ chatId, currentUser, text }) {
  assertFirebaseReady();

  const cleanText = text.trim();

  if (!cleanText) {
    return;
  }

  const chatRef = doc(db, FIREBASE_PATHS.chats, chatId);
  const messageRef = doc(collection(db, FIREBASE_PATHS.chats, chatId, FIREBASE_PATHS.messages));
  const batch = writeBatch(db);

  batch.set(messageRef, {
    type: "text",
    text: cleanText,
    senderId: currentUser.uid,
    createdAt: serverTimestamp(),
    clientCreatedAt: new Date().toISOString(),
    attachmentIds: [],
    deletedForEveryone: false,
  });

  batch.update(chatRef, {
    updatedAt: serverTimestamp(),
    lastMessageText: cleanText,
    lastMessageAt: serverTimestamp(),
    lastMessageSenderId: currentUser.uid,
  });

  await batch.commit();
}

export async function sendMediaMessage({ attachment, caption = "", chatId, currentUser }) {
  assertFirebaseReady();

  const cleanCaption = caption.trim();
  const chatRef = doc(db, FIREBASE_PATHS.chats, chatId);
  const attachmentRef = doc(db, FIREBASE_PATHS.chats, chatId, FIREBASE_PATHS.attachments, attachment.attachmentId);
  const messageRef = doc(collection(db, FIREBASE_PATHS.chats, chatId, FIREBASE_PATHS.messages));
  const previewText = cleanCaption || (attachment.type === "video" ? "Video" : "Photo");
  const attachmentSummary = {
    contentType: attachment.contentType,
    downloadURL: attachment.downloadURL,
    durationMillis: attachment.durationMillis || null,
    height: attachment.height || null,
    id: attachment.attachmentId,
    sizeBytes: attachment.sizeBytes || null,
    storagePath: attachment.storagePath,
    type: attachment.type,
    width: attachment.width || null,
  };
  const batch = writeBatch(db);

  batch.set(attachmentRef, {
    ...attachmentSummary,
    uploadedBy: currentUser.uid,
    createdAt: serverTimestamp(),
    messageId: messageRef.id,
  });

  batch.set(messageRef, {
    type: "media",
    text: cleanCaption,
    senderId: currentUser.uid,
    createdAt: serverTimestamp(),
    clientCreatedAt: new Date().toISOString(),
    attachmentIds: [attachment.attachmentId],
    attachments: [attachmentSummary],
    deletedForEveryone: false,
  });

  batch.update(chatRef, {
    updatedAt: serverTimestamp(),
    lastMessageText: previewText,
    lastMessageAt: serverTimestamp(),
    lastMessageSenderId: currentUser.uid,
  });

  await batch.commit();
}
