import { Stack } from "expo-router";

export default function AppLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#F8FAF8" },
        headerTitleStyle: { color: "#182230", fontWeight: "700" },
        headerShadowVisible: false,
      }}>
      <Stack.Screen name="index" options={{ title: "Chats" }} />
      <Stack.Screen name="new-chat" options={{ title: "New chat" }} />
      <Stack.Screen name="profile" options={{ title: "Profile" }} />
      <Stack.Screen name="chat/[chatId]" options={{ title: "Chat" }} />
    </Stack>
  );
}
