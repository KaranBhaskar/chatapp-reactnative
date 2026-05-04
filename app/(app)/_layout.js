import { Redirect, Stack } from "expo-router";

import { useAuthUser } from "../../src/hooks/useAuthUser";

export default function AppLayout() {
  const { authChecked, user } = useAuthUser();

  if (!authChecked) {
    return null;
  }

  if (!user) {
    return <Redirect href="/sign-in" />;
  }

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
