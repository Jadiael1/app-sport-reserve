import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Alert,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { api_url } from "../constants/constants";

const AgendarHorario = () => {
  const [fields, setFields] = useState([]);
  const [hours, setHours] = useState("");
  const [totalCost, setTotalCost] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  // Estados para o campo e horário
  const [selectedField, setSelectedField] = useState(undefined);
  const [selectedDate, setSelectedDate] = useState(undefined);
  const [selectedEndTime, setSelectedEndTime] = useState(undefined);
  const [selectedStartTime, setSelectedStartTime] = useState(undefined);

  useEffect(() => {
    fetchFields();
  }, []);

  const fetchFields = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${api_url}/fields`);
      if (response.data.status === "success") {
        setFields(response.data.data.data);
      } else {
        Alert.alert("Erro", "Não foi possível buscar os campos.");
      }
    } catch (error) {
      console.error("Erro ao buscar campos:", error);
      Alert.alert("Erro", "Não foi possível buscar os campos.");
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (fieldId) => {
    const field = fields.find((field) => field.id === fieldId);
    setSelectedField(field);
    fetchAvailableDates(fieldId);
  };

  const fetchAvailableDates = async (fieldId) => {
    try {
      const response = await axios.get(`${api_url}/fields/${fieldId}/dates`);
      if (response.data.status === "success") {
        setAvailableDates(response.data.data);
      } else {
        Alert.alert("Erro", "Não foi possível buscar os horários disponíveis.");
      }
    } catch (error) {
      console.error("Erro ao buscar horários disponíveis:", error);
      Alert.alert("Erro", "Não foi possível buscar os horários disponíveis.");
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    fetchAvailableTimes(selectedField.id, date);
  };

  const fetchAvailableTimes = async (fieldId, date) => {
    try {
      const response = await axios.get(
        `${api_url}/fields/${fieldId}/dates/${date}/times`
      );
      if (response.data.status === "success") {
        setAvailableTimes(response.data.data);
      } else {
        Alert.alert("Erro", "Não foi possível buscar os horários disponíveis.");
      }
    } catch (error) {
      console.error("Erro ao buscar horários disponíveis:", error);
      Alert.alert("Erro", "Não foi possível buscar os horários disponíveis.");
    }
  };

  const handleHoursChange = (value) => {
    setHours(value);
  };

  const calculateTotalCost = () => {
    if (selectedField && hours) {
      const cost = selectedField.hourly_rate * parseFloat(hours);
      setTotalCost(cost);
    }
  };

  const handleSchedule = async () => {
    if (
      !selectedField ||
      !selectedDate ||
      !selectedStartTime ||
      !selectedEndTime ||
      !hours
    ) {
      Alert.alert("Erro", "Preencha todos os campos para agendar.");
      return;
    }
    calculateTotalCost();
    // Implementar lógica para agendar horário
    try {
      const response = await axios.post(`${api_url}/reservations`, {
        field_id: selectedField.id,
        date: selectedDate,
        start_time: selectedStartTime,
        end_time: selectedEndTime,
        hours: parseFloat(hours),
      });
      console.log("Reserva feita:", response.data);
      Alert.alert(
        "Sucesso",
        `Horário agendado com sucesso! Total: R$ ${totalCost.toFixed(2)}`
      );
    } catch (error) {
      console.error("Erro ao agendar horário:", error);
      Alert.alert("Erro", "Não foi possível agendar o horário.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agendar Horário</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View style={styles.form}>
          {error && <Text style={styles.error}>{error}</Text>}
          <Text style={styles.label}>Selecione o Campo:</Text>
          <Picker
            selectedValue={selectedField?.id}
            onValueChange={(itemValue) => handleFieldChange(itemValue)}
            style={styles.picker}
          >
            {fields.map((field) => (
              <Picker.Item key={field.id} label={field.name} value={field.id} />
            ))}
          </Picker>
          <Text style={styles.label}>Selecione a Data:</Text>
          <Picker
            selectedValue={selectedDate}
            onValueChange={(itemValue) => handleDateChange(itemValue)}
            style={styles.picker}
          >
            {availableDates.map((date) => (
              <Picker.Item key={date} label={date} value={date} />
            ))}
          </Picker>
          <Text style={styles.label}>Selecione o Horário de Início:</Text>
          <Picker
            selectedValue={selectedStartTime}
            onValueChange={(itemValue) => setSelectedStartTime(itemValue)}
            style={styles.picker}
          >
            {availableTimes.map((time) => (
              <Picker.Item key={time} label={time} value={time} />
            ))}
          </Picker>
          <Text style={styles.label}>Selecione o Horário de Término:</Text>
          <Picker
            selectedValue={selectedEndTime}
            onValueChange={(itemValue) => setSelectedEndTime(itemValue)}
            style={styles.picker}
          >
            {availableTimes.map((time) => (
              <Picker.Item key={time} label={time} value={time} />
            ))}
          </Picker>

          <Text style={styles.label}>
            Custo Total: R$ {totalCost.toFixed(2)}
          </Text>
          <Pressable onPress={handleSchedule} style={styles.buttonAgendar}>
            <Text style={styles.txtBtnAgendar}>Agendar</Text>
          </Pressable>
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
  form: {
    width: "80%",
    marginTop: 30,
  },
  label: {
    fontSize: 18,
    color: "#3D5A80",
    marginBottom: 10,
  },
  picker: {
    backgroundColor: "#fff",
    borderRadius: 7,
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 7,
    marginBottom: 20,
    fontSize: 18,
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
  buttonAgendar: {
    // width: "50%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3D5A90",
    paddingVertical: 15,
    // paddingHorizontal: 80,
    borderRadius: 7,
    marginVertical: 20,
    elevation: 5,
  },
  txtBtnAgendar: {
    color: "#fff",
    textAlign: "center",
  },
});

export default AgendarHorario;
