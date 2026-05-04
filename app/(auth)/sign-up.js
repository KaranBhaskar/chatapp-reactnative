import { Link } from "expo-router";
import { Text, View } from "react-native";

import { Button } from "../../src/components/Button";
import { Screen } from "../../src/components/Screen";
import { TextField } from "../../src/components/TextField";

export default function SignUpScreen() {
  return (
    <Screen className="justify-center">
      <View className="gap-8">
        <View className="gap-3">
          <Text className="text-4xl font-bold text-ink">Create account</Text>
          <Text className="text-base leading-6 text-slate-600">
            This will create a Firebase Auth user and a Firestore profile later.
          </Text>
        </View>

        <View className="gap-4">
          <TextField label="Display name" placeholder="Karan" />
          <TextField label="Email" placeholder="you@example.com" keyboardType="email-address" />
          <TextField label="Password" placeholder="Choose a password" secureTextEntry />
          <Button label="Sign up" href="/" />
        </View>

        <View className="flex-row justify-center gap-1">
          <Text className="text-sm text-slate-600">Already have an account?</Text>
          <Link href="/sign-in" className="text-sm font-semibold text-fern">
            Sign in
          </Link>
        </View>
      </View>
    </Screen>
  );
}
