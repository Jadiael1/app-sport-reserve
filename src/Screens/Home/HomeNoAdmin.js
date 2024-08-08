import React, { useEffect } from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { useSession } from "../../context/UserContext";
import Validation from "../../app/validation";
import { router } from "expo-router";

export default function Home() {
  const { session, isAdmin, isLoading, signOut } = useSession();
  const [emailValid, setEmailValid] = React.useState(false);

  useEffect(() => {
    const checkUserVerification = async () => {
      if (isLoading) return;

      if (!session?.token) {
        router.navigate("index");
        return;
      }

      try {
        const response = await fetch(`${api_url}/auth/user`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session.token}`,
          },
        });

        const userData = await response.json();
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
  }, [session, isLoading]);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (!emailValid) {
    return session ? (
      <Validation token={session.token} email={session.email} />
    ) : null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.welcomeText}>Bem-vindo à sua Home!</Text>
        {/* Coloque aqui os componentes e conteúdo da Home para usuário não admin */}
        {isAdmin ? <Text>Você é um administrador</Text> : null}
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
