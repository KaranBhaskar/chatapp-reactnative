import { Link } from "expo-router";
import { Text, View } from "react-native";

import { Button } from "../../src/components/Button";
import { Screen } from "../../src/components/Screen";
import { TextField } from "../../src/components/TextField";

export default function SignInScreen() {
  return (
    <Screen className="justify-center">
      <View className="gap-8">
        <View className="gap-3">
          <Text className="text-4xl font-bold text-ink">MockChat</Text>
          <Text className="text-base leading-6 text-slate-600">
            Sign in to open your chats. Firebase Auth connects here in Iteration 2.
          </Text>
        </View>

        <View className="gap-4">
          <TextField label="Email" placeholder="you@example.com" keyboardType="email-address" />
          <TextField label="Password" placeholder="Your password" secureTextEntry />
          <Button label="Sign in" href="/" />
          <Button label="Continue with Google" variant="secondary" />
        </View>

        <View className="flex-row justify-center gap-1">
          <Text className="text-sm text-slate-600">New here?</Text>
          <Link href="/sign-up" className="text-sm font-semibold text-fern">
            Create an account
          </Link>
        </View>
      </View>
    </Screen>
  );
}
