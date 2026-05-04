import { Text, View } from "react-native";

import { Button } from "../../src/components/Button";
import { ChatListItem } from "../../src/components/ChatListItem";
import { EmptyState } from "../../src/components/EmptyState";
import { Screen } from "../../src/components/Screen";
import { mockChats } from "../../src/data/mockData";

export default function ChatListScreen() {
  return (
    <Screen>
      <View className="gap-6">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-3xl font-bold text-ink">Chats</Text>
            <Text className="mt-1 text-sm text-slate-500">Firestore chat list lands here.</Text>
          </View>
          <Button label="Profile" href="/profile" variant="secondary" />
        </View>

        <View className="flex-row gap-3">
          <Button label="New chat" href="/new-chat" className="flex-1" />
          <Button label="Sign out" href="/sign-in" variant="secondary" className="flex-1" />
        </View>

        <View className="gap-3">
          {mockChats.length > 0 ? (
            mockChats.map((chat) => <ChatListItem key={chat.id} chat={chat} />)
          ) : (
            <EmptyState title="No chats yet" subtitle="Create a chat after Firebase users exist." />
          )}
        </View>
      </View>
    </Screen>
  );
}
