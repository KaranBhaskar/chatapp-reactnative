import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Platform, Text, View } from "react-native";

import { Button } from "../../src/components/Button";
import { Screen } from "../../src/components/Screen";
import { TextField } from "../../src/components/TextField";
import { signInWithEmail, signInWithGoogle } from "../../src/firebase/auth";
import { useAuthUser } from "../../src/hooks/useAuthUser";

export default function SignInScreen() {
  const router = useRouter();
  const { firebaseReady, formatAuthError } = useAuthUser();
  const supportsGoogleSignIn = Platform.OS === "web";
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loadingProvider, setLoadingProvider] = useState("");
  const [password, setPassword] = useState("");

  async function handleEmailSignIn() {
    setError("");
    setLoadingProvider("email");

    try {
      await signInWithEmail({ email, password });
      router.replace("/");
    } catch (nextError) {
      setError(formatAuthError(nextError));
    } finally {
      setLoadingProvider("");
    }
  }

  async function handleGoogleSignIn() {
    setError("");
    setLoadingProvider("google");

    try {
      await signInWithGoogle();
      router.replace("/");
    } catch (nextError) {
      setError(formatAuthError(nextError));
    } finally {
      setLoadingProvider("");
    }
  }

  return (
    <Screen className="justify-center">
      <View className="gap-8">
        <View className="gap-3">
          <Text className="text-4xl font-bold text-ink">MockChat</Text>
          <Text className="text-base leading-6 text-slate-600">Sign in to open your chats.</Text>
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
          <TextField
            label="Email"
            placeholder="you@example.com"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <TextField
            label="Password"
            placeholder="Your password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <Button
            label="Sign in"
            disabled={!firebaseReady || !email || !password}
            loading={loadingProvider === "email"}
            onPress={handleEmailSignIn}
          />
          {supportsGoogleSignIn ? (
            <Button
              label="Continue with Google"
              variant="secondary"
              disabled={!firebaseReady}
              loading={loadingProvider === "google"}
              onPress={handleGoogleSignIn}
            />
          ) : null}
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
