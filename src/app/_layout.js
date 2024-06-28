import * as SplashScreen from "expo-splash-screen";
import {
  NavigationContainer,
  useNavigationContainerRef,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useFonts } from "expo-font";
import { useCallback, useState } from "react";
import { ActivityIndicator, StyleSheet, View, Text } from "react-native";
import TabNavigator from "../Navigation/TabNavigation";

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
  const [isAppReady, setAppReady] = useState(false);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded && !isAppReady) {
    return (
      <View style={styles.container}>
        <Text style={styles.logo}>SportReserve</Text>
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
});
