import { Text, View } from "react-native";

import { Avatar } from "../../src/components/Avatar";
import { Button } from "../../src/components/Button";
import { Screen } from "../../src/components/Screen";
import { mockUsers } from "../../src/data/mockData";

export default function NewChatScreen() {
  return (
    <Screen>
      <View className="gap-6">
        <View>
          <Text className="text-3xl font-bold text-ink">Start a chat</Text>
          <Text className="mt-2 text-sm leading-5 text-slate-500">
            For the learning app, this screen will show every signed-up test user except you.
          </Text>
        </View>

        <View className="gap-3">
          {mockUsers.map((user) => (
            <View
              key={user.id}
              className="flex-row items-center justify-between rounded-lg border border-slate-200 bg-white p-4">
              <View className="flex-row items-center gap-3">
                <Avatar label={user.initials} />
                <View>
                  <Text className="text-base font-semibold text-ink">{user.name}</Text>
                  <Text className="text-sm text-slate-500">{user.email}</Text>
                </View>
              </View>
              <Button label="Chat" href={`/chat/${user.chatId}`} variant="secondary" />
            </View>
          ))}
        </View>
      </View>
    </Screen>
  );
}
