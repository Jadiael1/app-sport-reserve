// components/ScheduledTimes.js

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Pressable,
  Alert,
} from "react-native";
import { fetchHorarios, SwitchPagamentos } from "../../api/api";
import { format } from "date-fns";
import Icon from "react-native-vector-icons/MaterialIcons";
import DateTime from "../../components/Inputs/DateTime";
import AsyncStorage from "@react-native-async-storage/async-storage";

const getStatusDetails = (status) => {
  switch (status) {
    case "PAID":
      return { displayName: "Pago", color: "#28a745", icon: "check-circle" };
    case "WAITING":
      return {
        displayName: "Pendente",
        color: "#ffc107",
        icon: "hourglass-empty",
      };
    case "canceled":
      return { displayName: "Cancelado", color: "#dc3545", icon: "cancel" };
    default:
      return { displayName: status, color: "#000", icon: "info" };
  }
};

const ScheduledTimes = () => {
  const [scheduledTimes, setScheduledTimes] = useState([]);
  const [dateFilter, setDateFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filteredTimes, setFilteredTimes] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loadingPayments, setLoadingPayments] = useState(false);

  useEffect(() => {
    const loadHorarios = async () => {
      setLoading(true);
      try {
        const horarios = await fetchHorarios();
        const sortedHorarios = horarios.sort(
          (a, b) => new Date(a.start_time) - new Date(b.start_time)
        );
        setScheduledTimes(sortedHorarios);
        setFilteredTimes(sortedHorarios);
      } catch (error) {
        setError("Erro ao carregar os horários");
        console.log("Erro ao carregar", error);
      } finally {
        setLoading(false);
      }
    };

    loadHorarios();
  }, []);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const isAdminValue = await AsyncStorage.getItem("IS_ADMIN");
        setIsAdmin(isAdminValue === "1");
      } catch (error) {
        console.log("Erro ao verificar status de admin:", error);
      }
    };

    checkAdminStatus();
  }, []);

  const handlePayments = async (reserveId) => {
    try {
      setLoadingPayments(true);
      await SwitchPagamentos(reserveId);
      await loadHorarios();
      Alert.alert("Sucesso", "Pagamento realizado com sucesso!");
    } catch (error) {
      console.log("Erro ao atualizar o pagamento", error);
      Alert.alert("Erro", "Não foi possível realizar o pagamento.");
    } finally {
      setLoadingPayments(false);
    }
  };

  const filterTimesByDate = () => {
    if (!dateFilter) {
      setFilteredTimes(scheduledTimes);
      return;
    }

    const parsedSelectedDate = parse(dateFilter, "dd/MM/yyyy", new Date());
    const filteredAndSortedTimes = scheduledTimes.filter((horario) => {
      const horarioDate = new Date(horario.start_time);
      return (
        horarioDate.getDate() === parsedSelectedDate.getDate() &&
        horarioDate.getMonth() === parsedSelectedDate.getMonth() &&
        horarioDate.getFullYear() === parsedSelectedDate.getFullYear()
      );
    });

    setFilteredTimes(filteredAndSortedTimes);
  };

  return (
    <View style={styles.container}>
      {isAdmin ? (
        <Text style={styles.title}>Horários Agendados</Text>
      ) : (
        <Text style={styles.title}>Meus Agendamentos</Text>
      )}

      <View style={styles.datePickerContainer}>
        <DateTime
          value={dateFilter}
          onChangeText={(text) => setDateFilter(text)}
          style={styles.dateInput}
        />
        <Pressable style={styles.datePickerButton} onPress={filterTimesByDate}>
          <Text style={styles.datePickerText}>Filtrar</Text>
        </Pressable>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : filteredTimes.length === 0 ? (
        <Text>Nenhum horário agendado</Text>
      ) : (
        <FlatList
          data={filteredTimes}
          renderItem={({ item, index }) => {
            const { displayName, color, icon } = getStatusDetails(item.status);

            return (
              <View style={styles.timeSlot} key={index}>
                <Text style={styles.label}>Nome do campo</Text>
                <Text style={styles.value}>{item.field.name}</Text>
                <Text style={styles.label}>Data</Text>
                <Text style={styles.value}>
                  {format(new Date(item.start_time), "dd/MM/yyyy")}
                </Text>
                <Text style={styles.label}>Hora de início</Text>
                <Text style={styles.value}>
                  {format(new Date(item.start_time), "HH:mm")}
                </Text>
                <Text style={styles.label}>Hora de término</Text>
                <Text style={styles.value}>
                  {format(new Date(item.end_time), "HH:mm")}
                </Text>
                {isAdmin && item.userName && (
                  <>
                    <Text style={styles.label}>Responsável</Text>
                    <Text style={styles.value}>{item.userName}</Text>
                  </>
                )}
                <Text style={styles.label}>Situação</Text>
                <View style={styles.statusContainer}>
                  <Icon name={icon} size={20} color={color} />
                  <Text style={[styles.value, { color: color }]}>
                    {displayName}
                  </Text>
                </View>
                {item.status === "WAITING" && (
                  <Pressable
                    style={styles.payButton}
                    onPress={() => handlePayments(item.id)}
                    disabled={loadingPayments}
                  >
                    {loadingPayments ? (
                      <ActivityIndicator size={"small"} color={"#fff"} />
                    ) : (
                      <Text style={styles.payButtonText}>Pagar</Text>
                    )}
                  </Pressable>
                )}
              </View>
            );
          }}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          contentContainerStyle={styles.timeList}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8F4F8",
    alignItems: "center",
    paddingTop: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#3D5A80",
    marginBottom: 20,
  },
  datePickerContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  dateInput: {
    backgroundColor: "#fff",
    borderColor: "#3D5A80",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    width: 150,
  },
  datePickerButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3D5A80",
    padding: 10,
    borderRadius: 5,
  },
  datePickerText: {
    color: "#fff",
    fontSize: 16,
  },
  timeList: {
    alignItems: "center",
  },
  timeSlot: {
    backgroundColor: "#fff",
    borderRadius: 7,
    padding: 15,
    marginVertical: 10,
    width: 300,
    alignItems: "center",
    elevation: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#3D5A80",
  },
  value: {
    fontSize: 16,
    color: "#000",
    marginBottom: 10,
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
  statusContainer: {
    flexDirection: "row",
  },
  payButton: {
    backgroundColor: "#28a745",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  payButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default ScheduledTimes;
