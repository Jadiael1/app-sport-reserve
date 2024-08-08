import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { api_url } from "../../constants/constants";
import { fetchHorarios } from "../../api/api";
import { format, parseISO, isToday } from "date-fns";
import { Ionicons, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import Validation from "../../app/validation";
import { useSession } from "../../context/UserContext";
import { getStatusDetails } from "../Horarios/horariosAgendados";

export default function AdminHome() {
  const router = useRouter();
  const { session, isLoading, error } = useSession();
  const [user, setUser] = useState(null);
  const [emailValid, setEmailValid] = useState(false);
  const [horarioDia, setHorarioDia] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(false);

  // Função para verificar a verificação do usuário
  const checkUserVerification = async () => {
    if (!session || isLoading || !session.token) {
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

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const userData = await response.json();

      if (userData && userData.email_verified_at !== null) {
        setEmailValid(true);
        setUser(userData);
      } else {
        setEmailValid(false);
        router.navigate("verify-email");
      }
    } catch (error) {
      console.error("Error checking user verification:", error);
      router.navigate("index");
    }
  };

  useEffect(() => {
    checkUserVerification();
  }, [session, isLoading]);

  // Renderizar indicador de carregamento
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </SafeAreaView>
    );
  }

  // Função para carregar horários
  const loadHorarios = async () => {
    setLoading(true);
    try {
      const horarios = await fetchHorarios();
      const horariosHoje = horarios.filter((horario) =>
        isToday(parseISO(horario.start_time))
      );
      setHorarioDia(horariosHoje);
    } catch (error) {
      console.log("Erro", error);
      Alert.alert("Erro ao recuperar os horários de hoje");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHorarios();
  }, []);

  // Renderizar componente de validação ou horários
  if (!emailValid) {
    return user ? (
      <Validation token={session.token} email={user.email} />
    ) : null;
  }

  const firstName = user?.data?.name?.split(" ")[0] || "";

  const renderHorarioItem = ({ item }) => {
    const { displayName, color, icon } = getStatusDetails(item.status);
    const disabledStyle =
      item.status === "CANCELED" ? styles.disabledItem : null;
    return (
      <View style={[styles.horarioItem, disabledStyle]}>
        <Text style={styles.horarioText}>
          <Ionicons name="football" size={24} color="#007AFF" />
          {item.field.name}
        </Text>
        <Text style={styles.horarioText}>
          <Ionicons name="time" size={24} color="#007AFF" />
          {format(parseISO(item.start_time), "HH:mm")}
        </Text>
        <Text style={styles.horarioText}>
          <FontAwesome name="times" size={24} color="#007AFF" />
          {format(parseISO(item.end_time), "HH:mm")}
        </Text>
        <Text style={styles.horarioText}>
          <FontAwesome name="user" size={24} color="#007AFF" />
          <Text style={styles.nameUser}>{item.user.name}</Text>
        </Text>
        <View style={styles.statusContainer}>
          <MaterialIcons name={icon} size={20} color={color} />
          <Text style={[styles.horarioText, { color: color }]}>
            {displayName}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Bem-vindo, {firstName}!</Text>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <>
          <Text style={styles.textHorarioDia}>
            Reservas do dia{" "}
            <Text style={styles.TextDateToday}>
              {format(currentDate, "dd/MM")}
            </Text>
          </Text>
          <FlatList
            data={horarioDia}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderHorarioItem}
            ListEmptyComponent={
              <Text style={styles.emptyText}>Nenhum horário para hoje</Text>
            }
            contentContainerStyle={styles.flatListContainer}
          />
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8F4F8",
  },
  header: {
    alignItems: "center",
    paddingVertical: 50,
    backgroundColor: "#007AFF",
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  textHorarioDia: {
    fontSize: 24,
    marginVertical: 20,
    textAlign: "center",
  },
  horarioItem: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  horarioText: {
    fontSize: 16,
  },
  TextDateToday: {
    fontWeight: "bold",
    textDecorationLine: "underline",
    color: "#FF0000",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  errorText: {
    fontSize: 16,
    alignSelf: "center",
    marginTop: 20,
    color: "#FF0000",
  },
  emptyText: {
    fontSize: 16,
    alignSelf: "center",
    marginTop: 20,
  },
  nameUser: {
    fontWeight: "bold",
    fontSize: 18,
  },
  flatListContainer: {
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  disabledItem: {
    opacity: 0.5,
  },
});
