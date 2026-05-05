import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, View } from "react-native";

import { Button } from "../../../src/components/Button";
import { EmptyState } from "../../../src/components/EmptyState";
import { MessageBubble } from "../../../src/components/MessageBubble";
import { Screen } from "../../../src/components/Screen";
import { pickChatMediaFromLibrary } from "../../../src/firebase/media";
import { useAuthUser } from "../../../src/hooks/useAuthUser";
import { useMessages } from "../../../src/hooks/useMessages";
import { useNetworkStatus } from "../../../src/hooks/useNetworkStatus";

export default function ChatRoomScreen() {
  const { chatId } = useLocalSearchParams();
  const chatCode = String(chatId || "").replace("dm_", "").slice(0, 5).toUpperCase();
  const { user } = useAuthUser();
  const { isOffline } = useNetworkStatus();
  const { error, loading, messages, sendMedia, sendMessage, sending, uploadProgress, uploading } = useMessages(chatId);
  const [text, setText] = useState("");

  async function handleSend() {
    const nextText = text.trim();

    if (!nextText) {
      return;
    }

    const sent = await sendMessage(nextText);

    if (sent) {
      setText("");
    }
  }

  async function handleAttach() {
    const media = await pickChatMediaFromLibrary();

    if (!media) {
      return;
    }

    const sent = await sendMedia(media, text);

    if (sent) {
      setText("");
    }
  }

  return (
    <Screen className="pb-0">
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", default: undefined })}
        className="flex-1"
        keyboardVerticalOffset={90}>
        <View className="flex-1 gap-4">
          <View className="flex-row items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3">
            <Button href="/" label="Chats" variant="secondary" className="min-h-10 px-3" />
            {chatCode ? <Text className="text-xs font-semibold uppercase text-slate-400">Chat {chatCode}</Text> : null}
          </View>

          {isOffline ? (
            <View className="rounded-lg border border-coral/30 bg-white px-4 py-3">
              <Text className="text-sm font-bold text-coral">You are offline</Text>
              <Text className="mt-1 text-xs text-slate-500">Reconnect to send new messages.</Text>
            </View>
          ) : null}

          {uploading ? (
            <View className="rounded-lg border border-fern/20 bg-white px-4 py-3">
              <Text className="text-sm font-bold text-ink">Uploading media</Text>
              <Text className="mt-1 text-xs text-slate-500">{Math.round(uploadProgress * 100)}% complete</Text>
            </View>
          ) : null}

          <ScrollView className="flex-1" contentContainerClassName="gap-3 pb-2">
            {error ? (
              <View className="rounded-lg border border-coral/30 bg-white p-4">
                <Text className="text-sm font-bold text-coral">{error}</Text>
              </View>
            ) : null}

            {loading ? (
              <EmptyState title="Loading messages" />
            ) : messages.length > 0 ? (
              messages.map((message) => (
                <MessageBubble currentUserId={user?.uid} key={message.id} message={message} />
              ))
            ) : (
              <EmptyState title="No messages yet" subtitle="Send the first message in this chat." />
            )}
          </ScrollView>

          <View className="flex-row items-center gap-3 border-t border-slate-200 bg-white py-4">
            <TextInput
              placeholder="Message"
              editable={Boolean(user) && !uploading}
              onChangeText={setText}
              value={text}
              className="min-h-12 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-4 text-base text-ink"
            />
            <Button
              label="Media"
              variant="secondary"
              disabled={!user || isOffline || sending || uploading}
              loading={uploading}
              onPress={handleAttach}
            />
            <Button
              label="Send"
              disabled={!user || isOffline || !text.trim() || uploading}
              loading={sending}
              onPress={handleSend}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}
