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
import { router } from "expo-router";
import { api_url } from "../../constants/constants";
import { fetchHorarios } from "../../api/api";
import { format, parseISO, isToday } from "date-fns";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Icon from "react-native-vector-icons/MaterialIcons";
import Validation from "../../app/validation";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Importa a função para os status
import { getStatusDetails } from "../Horarios/horariosAgendados";

export default function AdminHome() {
  const [user, setUser] = useState(null);
  const [emailValid, setEmailValid] = useState(false);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [horarioDia, setHorarioDia] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());

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

  useEffect(() => {
    const loadHorarios = async () => {
      setLoading(true);
      try {
        const horarios = await fetchHorarios();
        const horariosHoje = horarios.filter((horario) =>
          isToday(parseISO(horario.start_time))
        );
        setHorarioDia(horariosHoje);
      } catch (error) {
        console.log("erro", error);
        Alert.alert("Erro ao recuperar os horários de hoje");
      } finally {
        setLoading(false);
      }
    };
    loadHorarios();
  }, []);

  if (!emailValid) {
    return user ? <Validation token={token} email={user.email} /> : null;
  }

  const firstName = user && user.data.name ? user.data.name.split(" ")[0] : "";
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
          <FontAwesome name="times" size={24} color="#007AFF" />{" "}
          {format(parseISO(item.end_time), "HH:mm")}
        </Text>
        <Text style={styles.horarioText}>
          <FontAwesome name="user" size={24} color="#007AFF" /> {item.user.name}
        </Text>
        <View style={styles.statusContainer}>
          <Icon name={icon} size={20} color={color} />
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
        <ActivityIndicator size={"large"} color={"#0000ff"} />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <>
          <Text style={styles.textHorarioDia}>
            Horários de hoje{" "}
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
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    // justifyContent: "center",
    paddingVertical: 50,
    backgroundColor: "#007AFF",
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    // marginBottom: 20,

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
    marginTop: 10,
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
  flatListContainer: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  disabledItem: {
    opacity: 0.5,
  },
});
