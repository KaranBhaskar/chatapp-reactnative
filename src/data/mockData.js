export const mockChats = [
  {
    id: "dm_karan_alex",
    name: "Alex Demo",
    initials: "AD",
    preview: "This is where lastMessageText from Firestore will appear.",
    time: "9:41",
  },
  {
    id: "dm_karan_mira",
    name: "Mira Test",
    initials: "MT",
    preview: "Tap a chat to see the message route and composer.",
    time: "9:34",
  },
];

export const mockUsers = [
  {
    id: "uid_alex",
    name: "Alex Demo",
    email: "alex@example.com",
    initials: "AD",
    chatId: "dm_karan_alex",
  },
  {
    id: "uid_mira",
    name: "Mira Test",
    email: "mira@example.com",
    initials: "MT",
    chatId: "dm_karan_mira",
  },
];

export const mockMessages = [
  {
    id: "message_1",
    senderId: "them",
    text: "This route is app/(app)/chat/[chatId].js.",
    time: "9:38",
  },
  {
    id: "message_2",
    senderId: "me",
    text: "So adding a new file under app creates a new screen?",
    time: "9:39",
  },
  {
    id: "message_3",
    senderId: "them",
    text: "Exactly. Iteration 3 swaps these mock messages for Firestore listeners.",
    time: "9:40",
  },
];
