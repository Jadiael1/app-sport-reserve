import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../app/home";
import AgendarHorario from "../app/agendarHorario";
import HorariosAgendados from "../app/horariosAgendados";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="AgendarHorario"
        component={AgendarHorario}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="HorariosAgendados"
        component={HorariosAgendados}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}
