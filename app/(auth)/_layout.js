import { Redirect, Stack } from "expo-router";

import { useAuthUser } from "../../src/hooks/useAuthUser";

export default function AuthLayout() {
  const { authChecked, user } = useAuthUser();

  if (!authChecked) {
    return null;
  }

  if (user) {
    return <Redirect href="/" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="sign-up" />
    </Stack>
  );
}
