import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import api_url from "../constants/constants";
import useAuth from "../hooks/useAuth";
// import DatePicker from "../components/DatePicker";

const AgendarHorario = () => {
  const { isAuthenticated, loading } = useAuth();
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigation.navigate("login");
    }
  }, [isAuthenticated, loading, navigation]);

  const handleDateChange = async (date) => {
    setSelectedDate(date);
    setLoadingSlots(true);
    try {
      const response = await axios.get(`${api_url}/auth/users/${date}`);
      setAvailableTimeSlots(response.data);
    } catch (error) {
      setError("Erro ao buscar horários disponíveis");
      console.error("Erro ao buscar horários disponíveis:", error);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleSelectTimeSlot = (timeSlot) => {
    // Implementar aqui a lógica para agendar o horário selecionado
    // redirecionar para a tela de confirmação de reserva
    console.log("Horário selecionado:", timeSlot);
  };

  if (loading || loadingSlots) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agendar Horário</Text>
      {/* <DatePicker onSelectDate={handleDateChange} /> */}
      {error && <Text style={styles.error}>{error}</Text>}
      {selectedDate && (
        <View style={styles.timeSlotsContainer}>
          <Text style={styles.subtitle}>Horários Disponíveis:</Text>
          <FlatList
            data={availableTimeSlots}
            renderItem={({ item }) => (
              <Pressable
                style={styles.timeSlot}
                onPress={() => handleSelectTimeSlot(item)}
              >
                <Text style={styles.timeText}>{item}</Text>
              </Pressable>
            )}
            keyExtractor={(item) => item}
            contentContainerStyle={styles.timeList}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8F4F8",
    alignItems: "center",
    paddingTop: 30,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#3D5A80",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3D5A80",
    marginBottom: 10,
  },
  error: {
    color: "red",
    fontSize: 16,
    marginBottom: 10,
  },
  timeSlotsContainer: {
    marginTop: 20,
    width: "100%",
  },
  timeSlot: {
    backgroundColor: "#fff",
    borderRadius: 7,
    padding: 15,
    marginVertical: 10,
    width: "100%",
    alignItems: "center",
    elevation: 5,
  },
  timeText: {
    fontSize: 18,
    color: "#3D5A80",
  },
  timeList: {
    alignItems: "center",
  },
});

export default AgendarHorario;
