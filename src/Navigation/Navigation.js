import * as Linking from "expo-linking";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import TabNavigator from "./TabNavigation";
import LoginScreen from "../app/index";
import AgendarHorario from "../app/agendarHorario";
import HorariosAgendados from "../Screens/Horarios/horariosAgendados";
import ListaCampos from "../Screens/campos/Campos";
import signUp from "../app/signup";
import recoveryPassword from "../app/recoveryPassword";
// import { Profile } from "../app/profile";
import UserProfile from "../Screens/Profile/UsersProfile/UserProfile";  // Ensure correct path

const Stack = createStackNavigator();

const prefix = Linking.createURL("/");

const linking = {
  prefixes: [prefix],
  config: {
    screens: {
      home: "home",
      index: "index",
      agendarHorario: "agendarHorario",
      horariosAgendados: "horariosAgendados",
      recoveryPassword: "recoveryPassword",
      signup: "signUp",
      validation: "validation",
      listaCampos: "listaCampos",
      userProfile: "userProfile",
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
        name="signup"
        component={signUp}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="recoveryPassword"
        component={recoveryPassword}
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
      <Stack.Screen
        name="listaCampos"
        component={ListaCampos}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="userProfile"
        component={UserProfile}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
