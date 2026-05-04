import { Text, View } from "react-native";

const sizes = {
  default: "h-12 w-12",
  large: "h-24 w-24",
};

const textSizes = {
  default: "text-base",
  large: "text-3xl",
};

export function Avatar({ label, size = "default" }) {
  return (
    <View className={`${sizes[size]} items-center justify-center rounded-full bg-fern`}>
      <Text className={`${textSizes[size]} font-bold text-white`}>{label}</Text>
    </View>
  );
}
