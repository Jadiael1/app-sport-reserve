import * as SplashScreen from "expo-splash-screen";
import React, { useCallback, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useFonts } from "expo-font";
import AppNavigator from "../Navigation/Navigation";
import { SessionProvider } from "../context/UserContext";

const queryClient = new QueryClient();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    PoppinsReg: require("../../assets/fonts/Poppins-Regular.ttf"),
    PoppinsBold: require("../../assets/fonts/Poppins-Bold.ttf"),
    PoppinsSemiBold: require("../../assets/fonts/Poppins-SemiBold.ttf"),
    RenegadePursuit: require("../../assets/fonts/RenegadePursuit-ywMr5.ttf"),
    NewofWord: require("../../assets/fonts/News of the World wide.ttf"),
  });

  const [isAppReady, setAppReady] = useState(false);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
      setAppReady(true);
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return (
      <View style={styles.container}>
        <Text style={styles.logo}>
          Sport<Text style={styles.textReserve}>Reserve</Text>
        </Text>
        <Text>Aluguel fácil, jogo garantido</Text>
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={{ alignItems: "center", justifyContent: "center" }}
        />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          <AppNavigator />
        </SessionProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8F4F8",
    alignItems: "center",
    justifyContent: "center",
    gap: 30,
  },
  logo: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#3D5A80",
  },
  textReserve: {
    color: "#007BFF",
  },
});
