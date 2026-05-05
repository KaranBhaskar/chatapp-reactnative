import { Text, View } from "react-native";

import { Button } from "../../src/components/Button";
import { ChatListItem } from "../../src/components/ChatListItem";
import { EmptyState } from "../../src/components/EmptyState";
import { Screen } from "../../src/components/Screen";
import { useChats } from "../../src/hooks/useChats";

export default function ChatListScreen() {
  const { chats, error, loading } = useChats();

  return (
    <Screen>
      <View className="gap-6">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-3xl font-bold text-ink">Chats</Text>
            <Text className="mt-1 text-sm text-slate-500">Pick up where your conversations left off.</Text>
          </View>
          <Button label="Profile" href="/profile" variant="secondary" />
        </View>

        <Button label="New chat" href="/new-chat" />

        <View className="gap-3">
          {error ? (
            <View className="rounded-lg border border-coral/30 bg-white p-4">
              <Text className="text-sm font-bold text-coral">{error}</Text>
            </View>
          ) : null}

          {loading ? (
            <EmptyState title="Loading chats" />
          ) : chats.length > 0 ? (
            chats.map((chat) => <ChatListItem key={chat.id} chat={chat} />)
          ) : (
            <EmptyState title="No chats yet" subtitle="Tap New chat to start a conversation." />
          )}
        </View>
      </View>
    </Screen>
  );
}
