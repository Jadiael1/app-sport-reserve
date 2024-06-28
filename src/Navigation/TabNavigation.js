import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../app/home";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="home" component={Home} />
      {/* Adicione mais telas conforme necessário */}
    </Tab.Navigator>
  );
}
