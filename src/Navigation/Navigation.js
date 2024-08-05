import * as Linking from "expo-linking";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import TabNavigator from "./TabNavigation";
import LoginScreen from "../app/index";
import AgendarHorario from "../app/agendarHorario";
import HorariosAgendados from "../Screens/Horarios/horariosAgendados";
import ListaCampos from "../Screens/campos/Campos";
import SignUp from "../app/signup";
import RecoveryPassword from "../app/recoveryPassword";
import UserProfile from "../Screens/Profile/UsersProfile/UserProfile";
import RelatorioUsuarios from "../app/RelatorioUsuarios";

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
      signup: "signup",
      validation: "validation",
      listaCampos: "listaCampos",
      userProfile: "userProfile",
      RelatorioUsuarios: "RelatorioUsuarios",
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
        component={SignUp}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="recoveryPassword"
        component={RecoveryPassword}
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
      <Stack.Screen
        name="RelatorioUsuarios"
        component={RelatorioUsuarios}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
