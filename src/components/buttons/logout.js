import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import axios from "axios";
import { api_url } from "../../constants/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
// import { Button } from "react-native-elements";

export const Logout = () => {
  const [loadingLogout, setLoadingLogout] = useState(false);
  const navigation = useNavigation();
  const handleLogout = async () => {
    setLoadingLogout(true);
    try {
      const token = await AsyncStorage.getItem("TOKEN");

      if (!token) {
        throw new Error("Token não encontrado");
        setLoadingLogout(false);
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
      setLoadingLogout(false);
      navigation.navigate("index");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    } finally {
      setLoadingLogout(false);
    }
  };
  return (
    <View>
      <Pressable style={styles.containerLogout} onPress={handleLogout}>
        <MaterialIcons name="logout" size={24} color="black" />
        {loadingLogout ? (
          <ActivityIndicator size={"small"} color={"#007BFF"} />
        ) : (
          <>
            <Text style={styles.textSair}>Sair</Text>
          </>
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  containerLogout: {
    flexDirection: "row",

    marginLeft: 20,
    marginTop: 20,
  },
  textSair: {
    fontSize: 16,
    marginLeft: 10,
  },
});
