import { View, Text, StyleSheet, Pressable } from "react-native";
import React from "react";
import axios from "axios";
import { api_url } from "../../constants/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
export const Logout = () => {
  const navigation = useNavigation();
  const handleLogout = async () => {
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
      await AsyncStorage.removeItem("IS_ADMIN");
      navigation.navigate("index");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };
  return (
    <Pressable style={styles.btnSair} onPress={handleLogout}>
      <Text style={styles.btnSairText}>Sair</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
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
