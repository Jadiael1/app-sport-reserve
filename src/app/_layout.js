import * as SplashScreen from "expo-splash-screen";
import {
  NavigationContainer,
  useNavigationContainerRef,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useFonts } from "expo-font";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import { api_url } from "../constants/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const queryClient = new QueryClient();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    PoppinsReg: require("../../assets/fonts/Poppins-Regular.ttf"),
    PoppinsBold: require("../../assets/fonts/Poppins-Bold.ttf"),
    PoppinsSemiBold: require("../../assets/fonts/Poppins-SemiBold.ttf"),
  });

  const navigationRef = useNavigationContainerRef();
  const [isNavigationReady, setNavigationReady] = useState(false);
  const [initialRoute, setInitialRoute] = useState(null);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return (
      <ActivityIndicator
        size="large"
        color="#0000ff"
        style={{ alignItems: "center", justifyContent: "center" }}
      />
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <QueryClientProvider client={queryClient}>
        <Stack initialRouteName={initialRoute}>
          <Stack.Screen options={{ headerShown: false }} name="index" />
          <Stack.Screen options={{ headerShown: false }} name="signup" />
          <Stack.Screen options={{ headerShown: false }} name="home" />
          <Stack.Screen
            options={{ headerShown: false }}
            name="recoveryPassword"
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="horariosAgendados"
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="agendarHorario"
          />
        </Stack>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
