import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api_url } from "../constants/constants";
import { router } from "expo-router";

export default function Validation({ token }) {
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    getEmailFromStorage();
  }, []);

  const getEmailFromStorage = async () => {
    try {
      const storedEmail = await AsyncStorage.getItem("EMAIL");
      if (storedEmail) {
        setEmail(storedEmail);
      }
    } catch (error) {
      console.error("Erro ao pegar o email do asyncStorage:", error);
    }
  };

  const handleResend = async () => {
    setIsSending(true);
    setMessage("");
    try {
      const response = await axios.post(
        `${api_url}/auth/email/resend`,
        { email: email },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Verificação enviada com sucesso!!!!");
      setMessage("E-mail de verificação reenviado com sucesso!");
      setTimeout(() => {
        setIsSending(false);
        router.navigate("/");
      }, 3000);
    } catch (error) {
      if (
        error.response &&
        error.response.data.message === "Email already verified."
      ) {
        setMessage("O e-mail já foi verificado.");
      } else {
        setMessage("Falha ao reenviar e-mail de verificação.");
      }
      console.error("Erro ao reenviar e-mail de verificação:", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Verificamos que sua conta não está verificada. Por favor, caso não tenha
        feito a verificação, clique no botão abaixo.
      </Text>
      <Pressable
        style={styles.btnReenviar}
        onPress={handleResend}
        disabled={isSending}
      >
        {isSending ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.btnText}>Reenviar</Text>
        )}
      </Pressable>
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E8F4F8",
    padding: 20,
    alignItems: "center",
  },
  text: {
    marginBottom: 20,
    textAlign: "center",
  },
  btnReenviar: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
  },
  btnText: {
    color: "#fff",
  },
  message: {
    marginTop: 20,
    color: "green",
    textAlign: "center",
  },
});
