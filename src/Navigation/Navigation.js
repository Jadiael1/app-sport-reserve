import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import * as Linking from "expo-linking";
import TabNavigator from "./TabNavigation";
import LoginScreen from "../app/index";
import AgendarHorario from "../app/agendarHorario";
import HorariosAgendados from "../app/horariosAgendados";

const Stack = createStackNavigator();

const prefix = Linking.createURL("/");

const linking = {
  prefixes: [prefix],
  config: {
    screens: {
      home: "home",
      login: "index",
      agendarHorario: "agendarHorario",
      horariosAgendados: "horariosAgendados",
      recoveryPassword: "recoveryPassword",
      signup: "signup",
      validation: "validation",
    },
  },
};

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="index">
      <Stack.Screen
        name="index"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="home"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="agendarHorario"
        component={AgendarHorario}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="horariosAgendados"
        component={HorariosAgendados}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
