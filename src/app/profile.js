import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { api_url } from "../constants/constants";
import { useNavigation } from "@react-navigation/native";
import { StackActions } from "@react-navigation/native";
import { Logout } from "../components/buttons/logout";
export const Profile = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Logout />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E8F4F8",
  },
});
