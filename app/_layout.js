import "../global.css";

import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";

import { AuthProvider } from "../src/context/AuthContext";
import { useAuthUser } from "../src/hooks/useAuthUser";

SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({ duration: 350, fade: true });

export const unstable_settings = {
  initialRouteName: "(auth)",
};

function RootNavigator() {
  const { authChecked } = useAuthUser();

  useEffect(() => {
    if (authChecked) {
      SplashScreen.hideAsync();
    }
  }, [authChecked]);

  if (!authChecked) {
    return null;
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(app)" />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
