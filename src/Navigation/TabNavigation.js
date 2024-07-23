import React, { useState, useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  Ionicons,
  AntDesign,
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";

import Profile from "../Screens/Profile/ProfileUser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import HomeNoAdmin from "../Screens/Home/HomeNoAdmin";
import AdminHome from "../Screens/Home/HomeAdmin";
import AgendarHorario from "../app/agendarHorario";
import HorariosAgendados from "../Screens/Horarios/horariosAgendados";
import ListaCampos from "../Screens/campos/Campos";
import UserProfile from "../Screens/Profile/UsersProfile/UserProfile";
import AdminProfile from "../Screens/Profile/UsersProfile/AdminProfile";

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
            <FontAwesome5
              name={focused ? "clipboard" : "clipboard-list"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      {isAdmin ? (
        <>
          {/* <Tab.Screen
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
          /> */}
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
        name="userProfile"
        component={isAdmin ? AdminProfile : UserProfile}
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
