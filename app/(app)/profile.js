import { Link } from "expo-router";
import { Text, View } from "react-native";

import { Avatar } from "../../src/components/Avatar";
import { Button } from "../../src/components/Button";
import { Screen } from "../../src/components/Screen";

export default function ProfileScreen() {
  return (
    <Screen>
      <View className="gap-8">
        <View className="items-center gap-3">
          <Avatar label="KB" size="large" />
          <View className="items-center">
            <Text className="text-2xl font-bold text-ink">Karan Bhaskar</Text>
            <Text className="text-sm text-slate-500">karan@example.com</Text>
          </View>
        </View>

        <View className="rounded-lg border border-slate-200 bg-white p-4">
          <Text className="text-base font-semibold text-ink">Sign out behavior</Text>
          <Text className="mt-2 text-sm leading-5 text-slate-500">
            Iteration 2 connects this button to Firebase Auth, blocks message sending, and clears
            local private cache.
          </Text>
        </View>

        <Button label="Sign out" href="/sign-in" variant="danger" />

        <Link href="/" className="text-center text-sm font-semibold text-fern">
          Back to chats
        </Link>
      </View>
    </Screen>
  );
}
