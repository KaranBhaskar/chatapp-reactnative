import { useLocalSearchParams } from "expo-router";
import { KeyboardAvoidingView, Platform, Text, TextInput, View } from "react-native";

import { Button } from "../../../src/components/Button";
import { MessageBubble } from "../../../src/components/MessageBubble";
import { Screen } from "../../../src/components/Screen";
import { mockMessages } from "../../../src/data/mockData";
import { useAuthUser } from "../../../src/hooks/useAuthUser";

export default function ChatRoomScreen() {
  const { chatId } = useLocalSearchParams();
  const { user } = useAuthUser();

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
            {mockMessages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
          </View>

          <View className="flex-row items-center gap-3 border-t border-slate-200 bg-white py-4">
            <TextInput
              placeholder="Message"
              editable={Boolean(user)}
              className="min-h-12 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-4 text-base text-ink"
            />
            <Button label="Send" disabled={!user} />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}
