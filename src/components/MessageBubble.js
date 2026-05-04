import { Text, View } from "react-native";

export function MessageBubble({ currentUserId = "me", message }) {
  const mine = message.senderId === currentUserId;

  return (
    <View className={`max-w-[82%] ${mine ? "self-end" : "self-start"}`}>
      <View className={`rounded-lg px-4 py-3 ${mine ? "bg-fern" : "bg-white"}`}>
        <Text className={`text-base leading-6 ${mine ? "text-white" : "text-ink"}`}>{message.text}</Text>
      </View>
      <Text className={`mt-1 text-xs text-slate-400 ${mine ? "text-right" : "text-left"}`}>
        {message.time}
      </Text>
    </View>
  );
}
