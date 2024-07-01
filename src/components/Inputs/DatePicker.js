import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";

const DatePicker = ({ onSelectDate }) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setSelectedDate(date);
    onSelectDate(moment(date).format("DD-MM-YYYY"));
    hideDatePicker();
  };

  return (
    <View>
      <TouchableOpacity style={styles.button} onPress={showDatePicker}>
        <Text style={styles.buttonText}>Selecionar Data</Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
      {selectedDate && (
        <Text style={styles.selectedDateText}>
          Data Selecionada: {moment(selectedDate).format("DD/MM/YYYY")}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#3D5A80",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 7,
    marginBottom: 20,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
  },
  selectedDateText: {
    fontSize: 16,
    marginTop: 10,
    color: "#3D5A80",
  },
});

export default DatePicker;
