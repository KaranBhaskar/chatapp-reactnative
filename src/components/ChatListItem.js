import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";

import { Avatar } from "./Avatar";

export function ChatListItem({ chat }) {
  return (
    <Link href={`/chat/${chat.id}`} asChild>
      <Pressable className="flex-row items-center gap-3 rounded-lg border border-slate-200 bg-white p-4">
        <Avatar label={chat.initials} />
        <View className="min-w-0 flex-1">
          <View className="flex-row items-center justify-between gap-3">
            <Text className="text-base font-bold text-ink">{chat.name}</Text>
            {chat.time ? <Text className="text-xs text-slate-400">{chat.time}</Text> : null}
          </View>
          <Text className="mt-1 text-sm text-slate-500" numberOfLines={1}>
            {chat.preview}
          </Text>
        </View>
      </Pressable>
    </Link>
  );
}
