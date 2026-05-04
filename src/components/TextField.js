import { Text, TextInput, View } from "react-native";

export function TextField({ label, className = "", ...props }) {
  return (
    <View className={`gap-2 ${className}`}>
      <Text className="text-sm font-semibold text-ink">{label}</Text>
      <TextInput
        className="min-h-12 rounded-lg border border-slate-200 bg-white px-4 text-base text-ink"
        placeholderTextColor="#94A3B8"
        autoCapitalize="none"
        {...props}
      />
    </View>
  );
}
