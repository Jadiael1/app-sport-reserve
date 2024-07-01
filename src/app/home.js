import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api_url } from "../constants/constants";
import Validation from "./validation";
import { router } from "expo-router";

export default function Home() {
  const [user, setUser] = useState(null);
  const [emailValid, setEmailValid] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const checkUserVerification = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("TOKEN");

        if (!storedToken) {
          router.navigate("login");
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
        router.navigate("/");
      }
    };

    checkUserVerification();
  }, []);

  return (
    <View style={styles.container}>
      {emailValid ? (
        <>
          {/* Editar aqui para colocar o que for na Home */}
          <Text>Home</Text>
        </>
      ) : (
        user && <Validation token={token} email={user.email} />
      )}
    </View>
  );
}

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
  },
});
