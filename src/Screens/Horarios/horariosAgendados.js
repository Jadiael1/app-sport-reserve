import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { fetchHorarios, fetchFieldName } from "../../api/api";
import { format } from "date-fns";
import Icon from "react-native-vector-icons/MaterialIcons";

const getStatusDetails = (status) => {
  switch (status) {
    case "paid":
      return { displayName: "Pago", color: "#28a745", icon: "check-circle" };
    case "pending":
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadHorarios = async () => {
      setLoading(true);
      try {
        const horarios = await fetchHorarios();
        setScheduledTimes(horarios);
      } catch (error) {
        setError("Erro ao carregar os horários");
        console.log("erro ao carregar", error);
      } finally {
        setLoading(false);
      }
    };

    loadHorarios();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Horários Agendados</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : scheduledTimes === 0 ? (
        <Text>Nenhum horário agendado</Text>
      ) : (
        <FlatList
          data={scheduledTimes}
          renderItem={({ item, index }) => {
            const { displayName, color, icon } = getStatusDetails(item.status);
            const totalValue = parseFloat(item.total_value);

            return (
              <View style={styles.timeSlot} key={index}>
                <Text style={styles.label}>Nome do campo</Text>
                <Text style={styles.value}>{item.fieldName}</Text>
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
                <Text style={styles.label}>Valor total</Text>
                <Text style={styles.value}>
                  {isNaN(totalValue) ? "N/A" : `R$ ${totalValue.toFixed(2)}`}
                </Text>
                <Text style={styles.label}>Situação</Text>
                <View style={styles.statusContainer}>
                  <Icon name={icon} size={20} color={color} />
                  <Text style={[styles.value, { color: color }]}>
                    {displayName}
                  </Text>
                </View>
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
    paddingTop: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#3D5A80",
    marginBottom: 20,
  },
  datePickerButton: {
    backgroundColor: "#3D5A80",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
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
});

export default ScheduledTimes;
