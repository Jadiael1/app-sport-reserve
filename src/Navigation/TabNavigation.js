import React, { useState, useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  Ionicons,
  AntDesign,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { Profile } from "../app/profile";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Home from "../app/home";
import HomeNoAdmin from "../Screens/Home/HomeNoAdmin";
import AdminHome from "../Screens/Home/HomeAdmin";
import AgendarHorario from "../app/agendarHorario";
import HorariosAgendados from "../Screens/Horarios/horariosAgendados";
import ListaCampos from "../Screens/campos/Campos";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const adminStatus = await AsyncStorage.getItem("IS_ADMIN");
      setIsAdmin(JSON.parse(adminStatus));
    };

    checkAdmin();
  }, []);

  return (
    <Tab.Navigator
      screenOptions={{
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
        component={isAdmin ? AdminHome : HomeNoAdmin}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="HorariosAgendados"
        component={HorariosAgendados}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "clipboard-sharp" : "clipboard-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      {isAdmin ? (
        <>
          <Tab.Screen
            name="AgendarHorario"
            component={AgendarHorario}
            options={{
              headerShown: false,
              tabBarIcon: ({ color, size, focused }) => (
                <AntDesign
                  name={focused ? "pluscircle" : "pluscircleo"}
                  size={size}
                  color={color}
                />
              ),
            }}
          />
          <Tab.Screen
            name="ListaCampos"
            component={ListaCampos}
            options={{
              headerShown: false,
              tabBarIcon: ({ color, size, focused }) => (
                <MaterialCommunityIcons
                  name="soccer-field"
                  size={size}
                  color={color}
                />
              ),
            }}
          />
        </>
      ) : (
        <Tab.Screen
          name="AgendarHorario"
          component={AgendarHorario}
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size, focused }) => (
              <AntDesign
                name={focused ? "pluscircle" : "pluscircleo"}
                size={size}
                color={color}
              />
            ),
          }}
        />
      )}
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
