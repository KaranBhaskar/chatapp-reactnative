import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";

import { Avatar } from "../../src/components/Avatar";
import { Button } from "../../src/components/Button";
import { Screen } from "../../src/components/Screen";
import { createOrOpenDirectChat } from "../../src/firebase/firestore";
import { useAuthUser } from "../../src/hooks/useAuthUser";
import { useUsers } from "../../src/hooks/useUsers";

function initialsForUser(user) {
  const source = user.displayName || user.email || "User";
  return source
    .split(/[ @._-]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default function NewChatScreen() {
  const router = useRouter();
  const { formatAuthError, user } = useAuthUser();
  const { error, loading, users } = useUsers();
  const [actionError, setActionError] = useState("");
  const [openingUserId, setOpeningUserId] = useState("");

  async function handleOpenChat(otherUser) {
    setActionError("");
    setOpeningUserId(otherUser.uid);

    try {
      const chatId = await createOrOpenDirectChat({ currentUser: user, otherUser });
      router.push(`/chat/${chatId}`);
    } catch (nextError) {
      setActionError(formatAuthError(nextError));
    } finally {
      setOpeningUserId("");
    }
  }

  return (
    <Screen>
      <View className="gap-6">
        <View>
          <Text className="text-3xl font-bold text-ink">Start a chat</Text>
          <Text className="mt-2 text-sm leading-5 text-slate-500">Choose someone to message.</Text>
        </View>

        {error || actionError ? (
          <View className="rounded-lg border border-coral/30 bg-white p-4">
            <Text className="text-sm font-bold text-coral">{error || actionError}</Text>
          </View>
        ) : null}

        <View className="gap-3">
          {loading ? (
            <Text className="rounded-lg bg-white p-4 text-sm text-slate-500">Loading people...</Text>
          ) : users.length === 0 ? (
            <Text className="rounded-lg bg-white p-4 text-sm leading-5 text-slate-500">
              No one else is here yet.
            </Text>
          ) : null}

          {users.map((nextUser) => (
            <View
              key={nextUser.uid}
              className="flex-row items-center justify-between rounded-lg border border-slate-200 bg-white p-4">
              <View className="flex-row items-center gap-3">
                <Avatar label={initialsForUser(nextUser)} />
                <View>
                  <Text className="text-base font-semibold text-ink">{nextUser.displayName || "Unnamed user"}</Text>
                  <Text className="text-sm text-slate-500">{nextUser.email}</Text>
                </View>
              </View>
              <Button
                label="Chat"
                loading={openingUserId === nextUser.uid}
                onPress={() => handleOpenChat(nextUser)}
                variant="secondary"
              />
            </View>
          ))}
        </View>
      </View>
    </Screen>
  );
}
