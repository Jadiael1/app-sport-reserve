import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Validation from "./validation";
import { router } from "expo-router";
import { api_url } from "../../constants/constants";

export default function Home() {
  const [user, setUser] = useState(null);
  const [emailValid, setEmailValid] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const checkUserVerification = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("TOKEN");

        if (!storedToken) {
          router.navigate("index");
          return;
        }
        setToken(storedToken);

        const response = await fetch(`${api_url}/auth/user`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        const userData = await response.json();
        setUser(userData);

        // Verifica se o e-mail foi verificado
        if (userData && userData.email_verified_at !== null) {
          setEmailValid(true);
        } else {
          setEmailValid(false);
        }
      } catch (error) {
        console.error("Error checking user verification:", error);
        router.navigate("index");
      }
    };

    checkUserVerification();
  }, []);

  if (!emailValid) {
    return user ? <Validation token={token} email={user.email} /> : null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.welcomeText}>Bem-vindo à sua Home!</Text>
        {/* Coloque aqui os componentes e conteúdo da Home para usuário não admin */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8F4F8",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
});
