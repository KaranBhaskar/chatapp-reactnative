import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, Text, TextInput, View } from "react-native";

import { Button } from "../../../src/components/Button";
import { EmptyState } from "../../../src/components/EmptyState";
import { MessageBubble } from "../../../src/components/MessageBubble";
import { Screen } from "../../../src/components/Screen";
import { useAuthUser } from "../../../src/hooks/useAuthUser";
import { useMessages } from "../../../src/hooks/useMessages";

export default function ChatRoomScreen() {
  const { chatId } = useLocalSearchParams();
  const { user } = useAuthUser();
  const { error, loading, messages, sendMessage, sending } = useMessages(chatId);
  const [text, setText] = useState("");

  async function handleSend() {
    const nextText = text.trim();

    if (!nextText) {
      return;
    }

    await sendMessage(nextText);
    setText("");
  }

  return (
    <Screen className="pb-0">
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", default: undefined })}
        className="flex-1"
        keyboardVerticalOffset={90}>
        <View className="flex-1 gap-4">
          <View className="rounded-lg bg-mist px-4 py-3">
            <Text className="text-sm font-semibold text-ink">Chat id: {chatId}</Text>
            <Text className="mt-1 text-xs text-slate-500">
              Messages will stream from chats/{chatId}/messages in Iteration 3.
            </Text>
          </View>

          <View className="flex-1 gap-3">
            {error ? (
              <View className="rounded-lg border border-coral/30 bg-white p-4">
                <Text className="text-sm font-bold text-coral">{error}</Text>
              </View>
            ) : null}

            {loading ? (
              <EmptyState title="Loading messages" subtitle="Firestore is attaching a realtime listener." />
            ) : messages.length > 0 ? (
              messages.map((message) => (
                <MessageBubble currentUserId={user?.uid} key={message.id} message={message} />
              ))
            ) : (
              <EmptyState title="No messages yet" subtitle="Send the first message in this chat." />
            )}
          </View>

          <View className="flex-row items-center gap-3 border-t border-slate-200 bg-white py-4">
            <TextInput
              placeholder="Message"
              editable={Boolean(user)}
              onChangeText={setText}
              value={text}
              className="min-h-12 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-4 text-base text-ink"
            />
            <Button label="Send" disabled={!user || !text.trim()} loading={sending} onPress={handleSend} />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}
