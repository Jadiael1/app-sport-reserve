import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Pressable,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import api_url from "../../constants/constants";

const ScheduledTimes = () => {
  const [scheduledTimes, setScheduledTimes] = useState([]);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Horários Agendados</Text>
      <Pressable
        style={styles.datePickerButton}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={styles.datePickerText}>Selecionar Data</Text>
      </Pressable>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onChangeDate}
        />
      )}
      <FlatList
        data={scheduledTimes}
        renderItem={({ item }) => (
          <View style={styles.timeSlot}>
            <Text style={styles.timeText}>{item.time}</Text>
            <Text>{item.date}</Text>
          </View>
        )}
        keyExtractor={(item) => `${item.date}-${item.time}`}
        contentContainerStyle={styles.timeList}
      />
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
  timeText: {
    fontSize: 18,
    color: "#3D5A80",
    marginBottom: 10,
  },
});

export default ScheduledTimes;
