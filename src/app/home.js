import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, SafeAreaView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api_url } from "../constants/constants";
import Validation from "./validation";
import { router } from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";

export default function Home() {
  const [user, setUser] = useState(null);
  const [emailValid, setEmailValid] = useState(false);
  const [token, setToken] = useState(null);
  const navigation = useNavigation();

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
        console.log(user);
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

  const firstName = user && user.data.name ? user.data.name.split(" ")[0] : "";
  return (
    <View style={styles.container}>
      {emailValid ? (
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <Text style={styles.welcomeText}>Bem-vindo, {firstName}!</Text>
          </View>
          <View style={styles.content}>
            <Pressable
              style={styles.button}
              // onPress={() => navigation.navigate("Schedule")}
            >
              <Icon name="schedule" size={24} color="#fff" />
              <Text style={styles.buttonText}>Agendar Horário</Text>
            </Pressable>
            <Pressable
              style={styles.button}
              onPress={() => navigation.navigate("HorariosAgendados")}
            >
              <Icon name="calendar-today" size={24} color="#fff" />

              <Text style={styles.buttonText}>Minhas Reservas</Text>
            </Pressable>
            <Pressable
              style={styles.button}
              // onPress={() => navigation.navigate("Profile")}
            >
              <Icon name="person" size={24} color="#fff" />
              <Text style={styles.buttonText}>Perfil</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      ) : (
        user && <Validation token={token} email={user.email} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8F4F8",
    justifyContent: "center",
    alignItems: "center",
  },
  safeArea: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    paddingTop: 120,
    paddingBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#3D5A80",
  },
  content: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3D5A80",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 7,
    marginVertical: 10,
    width: "80%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    marginLeft: 10,
  },
});
