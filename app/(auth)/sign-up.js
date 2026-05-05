import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";

import { Button } from "../../src/components/Button";
import { Screen } from "../../src/components/Screen";
import { TextField } from "../../src/components/TextField";
import { signUpWithEmail } from "../../src/firebase/auth";
import { useAuthUser } from "../../src/hooks/useAuthUser";

export default function SignUpScreen() {
  const router = useRouter();
  const { firebaseReady, formatAuthError } = useAuthUser();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");

  async function handleSignUp() {
    setError("");
    setLoading(true);

    try {
      await signUpWithEmail({ displayName, email, password });
      router.replace("/");
    } catch (nextError) {
      setError(formatAuthError(nextError));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen className="justify-center">
      <View className="gap-8">
        <View className="gap-3">
          <Text className="text-4xl font-bold text-ink">Create account</Text>
          <Text className="text-base leading-6 text-slate-600">Join the conversation in a few seconds.</Text>
        </View>

        {!firebaseReady ? (
          <View className="rounded-lg border border-coral/30 bg-white p-4">
            <Text className="text-sm font-bold text-coral">Service unavailable</Text>
            <Text className="mt-2 text-sm leading-5 text-slate-600">Please try again soon.</Text>
          </View>
        ) : null}

        {error ? (
          <View className="rounded-lg border border-coral/30 bg-white p-4">
            <Text className="text-sm font-bold text-coral">{error}</Text>
          </View>
        ) : null}

        <View className="gap-4">
          <TextField label="Display name" placeholder="Karan" value={displayName} onChangeText={setDisplayName} />
          <TextField
            label="Email"
            placeholder="you@example.com"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <TextField
            label="Password"
            placeholder="Choose a password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <Button
            label="Sign up"
            disabled={!firebaseReady || !displayName || !email || !password}
            loading={loading}
            onPress={handleSignUp}
          />
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
