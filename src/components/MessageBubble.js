import { Image, Linking, Text, View } from "react-native";

import { Button } from "./Button";

function formatMessageTime(message) {
  const date = message.createdAt?.toDate?.() || (message.clientCreatedAt ? new Date(message.clientCreatedAt) : null);

  if (!date || Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export function MessageBubble({ currentUserId = "me", message }) {
  const mine = message.senderId === currentUserId;
  const attachment = message.attachments?.[0];
  const time = message.time || formatMessageTime(message);

  return (
    <View className={`max-w-[82%] ${mine ? "self-end" : "self-start"}`}>
      <View className={`rounded-lg px-4 py-3 ${mine ? "bg-fern" : "bg-white"}`}>
        {attachment?.type === "image" ? (
          <Image
            source={{ uri: attachment.downloadURL }}
            resizeMode="cover"
            className="mb-3 h-56 w-56 rounded-md bg-slate-100"
          />
        ) : null}

        {attachment?.type === "video" ? (
          <View className={`mb-3 rounded-md p-3 ${mine ? "bg-white/15" : "bg-mist"}`}>
            <Text className={`mb-2 text-sm font-bold ${mine ? "text-white" : "text-ink"}`}>Video attachment</Text>
            <Button
              label="Open video"
              variant={mine ? "secondary" : "primary"}
              onPress={() => Linking.openURL(attachment.downloadURL)}
            />
          </View>
        ) : null}

        {message.text ? (
          <Text className={`text-base leading-6 ${mine ? "text-white" : "text-ink"}`}>{message.text}</Text>
        ) : null}
      </View>
      {time ? <Text className={`mt-1 text-xs text-slate-400 ${mine ? "text-right" : "text-left"}`}>{time}</Text> : null}
    </View>
  );
}
