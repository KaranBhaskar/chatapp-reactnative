import { Text, View } from "react-native";

export function EmptyState({ title, subtitle }) {
  return (
    <View className="items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white px-6 py-10">
      <Text className="text-lg font-bold text-ink">{title}</Text>
      {subtitle ? <Text className="mt-2 text-center text-sm leading-5 text-slate-500">{subtitle}</Text> : null}
    </View>
  );
}
