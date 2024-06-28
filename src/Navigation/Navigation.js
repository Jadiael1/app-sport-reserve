import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import TabNavigator from "./TabNavigator";
import VerificationScreen from "../screens/VerificationScreen";
import * as Linking from "expo-linking";
import TabNavigator from "./TabNavigation";
const Stack = createStackNavigator();

const prefix = Linking.createURL("/");

const linking = {
  prefixes: [prefix],
  config: {
    screens: {
      Home: "home",
      Login: "login",
      Verification: {
        path: "auth/email/verify",
        parse: {
          id: (id) => `${id}`,
          expires: (expires) => `${expires}`,
          signature: (signature) => `${signature}`,
        },
      },
    },
  },
};

export default function AppNavigator() {
  return (
    <NavigationContainer linking={linking}>
      <TabNavigator />
    </NavigationContainer>
  );
}
