import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import axios from "axios";
import { api_url } from "../constants/constants";

export default function VerificationScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { id, expires, signature } = route.params;

  const [message, setMessage] = useState("Verificando sua conta...");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.post(`${api_url}/auth/email/verify`, {
          id,
          expires,
          signature,
        });
        setMessage("Conta verificada com sucesso!");
        setTimeout(() => {
          navigation.navigate("Home");
        }, 2000);
      } catch (error) {
        setMessage(
          "Falha na verificação da conta. Por favor, tente novamente."
        );
        console.error("Erro na verificação:", error);
      }
    };

    verifyEmail();
  }, [id, expires, signature]);

  return (
    <View style={styles.container}>
      <Text>{message}</Text>
      {message === "Verificando sua conta..." && (
        <ActivityIndicator size="large" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
