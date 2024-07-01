import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { api_url } from "../constants/constants";
import { useNavigation } from "@react-navigation/native";
import { StackActions } from "@react-navigation/native";

export const Profile = () => {
  const navigation = useNavigation();

  const logout = async () => {
    try {
      const token = await AsyncStorage.getItem("TOKEN");

      if (!token) {
        throw new Error("Token não encontrado");
      }

      const response = await axios.post(
        `${api_url}/auth/signout`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await AsyncStorage.removeItem("TOKEN");
      await AsyncStorage.removeItem("EMAIL");
      await AsyncStorage.removeItem("EMAIL_VERIFIED_AT");

      navigation.dispatch(StackActions.replace("index"));
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={logout} style={styles.btnSair}>
        <Text style={styles.btnSairText}>Sair</Text>
      </Pressable>
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
  btnSair: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
  },
  btnSairText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
