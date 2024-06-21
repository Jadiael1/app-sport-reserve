// src/app/layout.js
import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useCallback } from "react";
import { ActivityIndicator } from "react-native";
import Toast from "react-native-toast-message";

const queryClient = new QueryClient();

export default function RootLayout() {
  <>
    <Toast />
  </>;
  const [fontsLoaded] = useFonts({
    PoppinsReg: require("../../assets/fonts/Poppins-Regular.ttf"),
    PoppinsBold: require("../../assets/fonts/Poppins-Bold.ttf"),
    PoppinsSemiBold: require("../../assets/fonts/Poppins-SemiBold.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <QueryClientProvider client={queryClient}>
        <Stack>
          <Stack.Screen options={{ headerShown: false }} name="index" />
          <Stack.Screen options={{ headerShown: false }} name="signup" />
          <Stack.Screen options={{ headerShown: false }} name="home" />
          {/* <Stack.Screen options={{ headerShown: false }} name="signupUser" /> */}
        </Stack>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
