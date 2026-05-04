import { Link } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";

import { Avatar } from "../../src/components/Avatar";
import { Button } from "../../src/components/Button";
import { Screen } from "../../src/components/Screen";
import { useAuthUser } from "../../src/hooks/useAuthUser";

function initialsForUser(user) {
  const source = user?.displayName || user?.email || "User";
  return source
    .split(/[ @._-]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default function ProfileScreen() {
  const { formatAuthError, signOutAndClearCache, user } = useAuthUser();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignOut() {
    setError("");
    setLoading(true);

    try {
      await signOutAndClearCache();
    } catch (nextError) {
      setError(formatAuthError(nextError));
      setLoading(false);
    }
  }

  return (
    <Screen>
      <View className="gap-8">
        <View className="items-center gap-3">
          <Avatar label={initialsForUser(user)} size="large" />
          <View className="items-center">
            <Text className="text-2xl font-bold text-ink">{user?.displayName || "Signed-in user"}</Text>
            <Text className="text-sm text-slate-500">{user?.email}</Text>
          </View>
        </View>

        <View className="rounded-lg border border-slate-200 bg-white p-4">
          <Text className="text-base font-semibold text-ink">Sign out behavior</Text>
          <Text className="mt-2 text-sm leading-5 text-slate-500">
            Iteration 2 connects this button to Firebase Auth, blocks message sending, and clears
            local private cache.
          </Text>
        </View>

        {error ? (
          <View className="rounded-lg border border-coral/30 bg-white p-4">
            <Text className="text-sm font-bold text-coral">{error}</Text>
          </View>
        ) : null}

        <Button label="Sign out" variant="danger" loading={loading} onPress={handleSignOut} />

        <Link href="/" className="text-center text-sm font-semibold text-fern">
          Back to chats
        </Link>
      </View>
    </Screen>
  );
}
