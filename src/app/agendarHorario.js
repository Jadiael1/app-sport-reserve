import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  Alert,
  SafeAreaView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "react-native-modal-datetime-picker";
import axios from "axios";
import Icon from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import * as WebBrowser from "expo-web-browser";
import { fetchFields } from "../api/api";

const api_url = "https://api-sport-reserve.juvhost.com/api/v1";

const AgendarHorario = () => {
  const navigation = useNavigation();
  const [fields, setFields] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // campos do form
  const [selectedField, setSelectedField] = useState(undefined);
  const [selectedDate, setSelectedDate] = useState(undefined);
  const [selectedStartTime, setSelectedStartTime] = useState(undefined);
  const [selectedEndTime, setSelectedEndTime] = useState(undefined);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const availableStartTimes = [
    "Selecione",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
    "22:00",
    "23:00",
  ];
  const availableEndTimes = [
    "Selecione",
    "19:00",
    "20:00",
    "21:00",
    "22:00",
    "23:00",
    "00:00",
  ];

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const fetchedFields = await fetchFields();
        setFields(fetchedFields);
      } catch (error) {
        setError("Não foi possível buscar os campos.");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    if (selectedField && selectedStartTime && selectedEndTime) {
      const start = new Date(`1970-01-01T${selectedStartTime}:00`);
      const end = new Date(`1970-01-01T${selectedEndTime}:00`);
      const hoursDiff = (end - start) / 1000 / 3600;
      const cost = selectedField.hourly_rate * hoursDiff;
      setTotalCost(cost);
    }
  }, [selectedField, selectedStartTime, selectedEndTime]);

  const handleFieldChange = (fieldId) => {
    const field = fields.find((field) => field.id === fieldId);
    setSelectedField(field);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setShowDatePicker(false);
  };

  const resetForm = () => {
    setSelectedField(undefined);
    setSelectedDate(undefined);
    setSelectedStartTime(undefined);
    setSelectedEndTime(undefined);
    setTotalCost(0);
  };

  const SwitchPagamentos = async (reserveId) => {
    try {
      const token = await AsyncStorage.getItem("TOKEN");
      const response = await axios.post(
        `${api_url}/payments/reservations/${reserveId}/pay`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const paymentUrl = response.data.data.url;
      console.log(paymentUrl);
      WebBrowser.openBrowserAsync(paymentUrl);
    } catch (error) {
      console.log("Erro ao redirecionar para pagamento:", error);
      Alert.alert(
        "Erro",
        "Não foi possível redirecionar para a página de pagamento."
      );
    }
  };

  const handleSchedule = async () => {
    if (
      !selectedField ||
      !selectedDate ||
      !selectedStartTime ||
      !selectedEndTime
    ) {
      Alert.alert("Erro", "Preencha todos os campos para agendar.");
      return;
    }

    const start = new Date(`1970-01-01T${selectedStartTime}:00`);
    const end = new Date(`1970-01-01T${selectedEndTime}:00`);
    const hoursDiff = (end - start) / 1000 / 3600;
    const cost = selectedField.hourly_rate * hoursDiff;
    setTotalCost(cost);

    if (hoursDiff <= 0) {
      Alert.alert(
        "Erro",
        "O horário de término deve ser após o horário de início."
      );
      return;
    }

    try {
      const token = await AsyncStorage.getItem("TOKEN");
      const response = await axios.post(
        `${api_url}/reservations`,
        {
          field_id: selectedField.id,
          start_time: `${
            selectedDate.toISOString().split("T")[0]
          }T${selectedStartTime}:00`,
          end_time: `${
            selectedDate.toISOString().split("T")[0]
          }T${selectedEndTime}:00`,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const reservationId = response.data.data.id;
      console.log("Reserva feita:", response.data);

      Alert.alert(
        "Sucesso",
        `Horário agendado com sucesso! Total: R$ ${totalCost.toFixed(2)}`,
        [
          {
            text: "Pagamento",
            onPress: () => {
              setLoading(true);
              resetForm();
              setTimeout(() => {
                SwitchPagamentos(reservationId);
              }, 2000);
            },
          },
        ]
      );
    } catch (error) {
      console.error("Erro ao agendar horário:", error);
      Alert.alert("Erro", "Não foi possível agendar o horário.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Agendar Horário</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View style={styles.form}>
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
          <Pressable
            onPress={() => setShowDatePicker(true)}
            style={styles.datePickerButton}
          >
            <Icon name="calendar-today" size={24} color="#3D5A80" />
            <Text style={styles.datePickerButtonText}>
              {selectedDate
                ? selectedDate.toLocaleDateString()
                : "Selecione a Data"}
            </Text>
          </Pressable>
          <DateTimePicker
            isVisible={showDatePicker}
            mode="date"
            display="calendar"
            onConfirm={handleDateChange}
            onCancel={() => setShowDatePicker(false)}
          />
          <Text style={styles.label}>Selecione o Horário de Início:</Text>
          <Picker
            selectedValue={selectedStartTime}
            onValueChange={(itemValue) => setSelectedStartTime(itemValue)}
            style={styles.picker}
          >
            {availableStartTimes.map((time) => (
              <Picker.Item key={time} label={time} value={time} />
            ))}
          </Picker>
          <Text style={styles.label}>Selecione o Horário de Término:</Text>
          <Picker
            selectedValue={selectedEndTime}
            onValueChange={(itemValue) => setSelectedEndTime(itemValue)}
            style={styles.picker}
          >
            {availableEndTimes.map((time) => (
              <Picker.Item key={time} label={time} value={time} />
            ))}
          </Picker>
          <Text style={styles.label}>
            Custo Total:{" "}
            <Text
              style={{
                fontWeight: "bold",
                color: "#000",
                textDecorationLine: "underline",
              }}
            >
              R$ {totalCost.toFixed(2)}
            </Text>
          </Text>
          <Pressable onPress={handleSchedule} style={styles.buttonAgendar}>
            <Text style={styles.txtBtnAgendar}>Agendar</Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8F4F8",
    alignItems: "center",
    justifyContent: "center",
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
    borderRadius: 20,
    marginBottom: 20,
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
  buttonAgendar: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3D5A90",
    paddingVertical: 15,
    borderRadius: 7,
    marginVertical: 20,
    elevation: 5,
  },
  txtBtnAgendar: {
    color: "#fff",
    textAlign: "center",
  },
  datePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 7,
    marginBottom: 20,
  },
  datePickerButtonText: {
    color: "#3D5A80",
    fontSize: 16,
    marginLeft: 10,
  },
});

export default AgendarHorario;
