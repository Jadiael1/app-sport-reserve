import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// Icones
import { Ionicons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// Paginas
import Home from "../app/home";
import AgendarHorario from "../app/agendarHorario";
import HorariosAgendados from "../Screens/Horarios/horariosAgendados";
import { Profile } from "../app/profile";
import ListaCampos from "../Screens/campos/Campos";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        // tabBarActiveTintColor: "blue",
        tabBarInactiveTintColor: "#fff",
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#171626",
          borderTopWidth: 0,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => {
            if (focused) {
              return <Ionicons name="home" size={size} color={color} />;
            }
            return <Ionicons name="home-outline" size={size} color={color} />;
          },
        }}
      />

      <Tab.Screen
        name="HorariosAgendados"
        component={HorariosAgendados}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => {
            if (focused) {
              return (
                <Ionicons name="clipboard-sharp" size={size} color={color} />
              );
            }
            return (
              <Ionicons name="clipboard-outline" size={size} color={color} />
            );
          },
        }}
      />

      <Tab.Screen
        name="AgendarHorario"
        component={AgendarHorario}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => {
            if (focused) {
              return <AntDesign name="pluscircle" size={size} color={color} />;
            }
            return <AntDesign name="pluscircleo" size={size} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name="ListaCampos"
        component={ListaCampos}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => {
            if (focused) {
              return (
                <MaterialCommunityIcons
                  name="soccer-field"
                  size={size}
                  color={color}
                />
              );
            }
            return (
              <MaterialCommunityIcons
                name="soccer-field"
                size={size}
                color={color}
              />
            );
          },
        }}
      />

      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => {
            if (focused) {
              return <Ionicons name="person" size={size} color={color} />;
            }
            return <Ionicons name="person-outline" size={size} color={color} />;
          },
        }}
      />
    </Tab.Navigator>
  );
}
