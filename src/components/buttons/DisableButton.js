import axios from "axios";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Switch } from "react-native";
import { api_url } from "../../constants/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function DisableButton() {
  const [isDisabled, setIsDisabled] = useState(false);
  const [status, setStatus] = useState(false);

  useEffect(() => {
    handleStatusField();
  }, []);

  const handleStatusField = async () => {
    const token = await AsyncStorage.getItem("TOKEN");
    try {
      const response = await axios.get(`${api_url}/fields`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStatus(response.data);
      console.log("status atualizado", response.data);
    } catch (error) {
      console.log("erro ao adquirir status", error);
    }
  };

  const toggleStatus = () => {
    setIsDisabled((previousState) => !previousState);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.normalText}>Situação: </Text>
      <Text
        style={[styles.statusText, { color: isDisabled ? "red" : "green" }]}
      >
        {isDisabled ? "Inativo" : "Ativo"}
      </Text>

      <Switch
        trackColor={{ false: "#767577", true: "#767577" }}
        thumbColor={isDisabled ? "red" : "green"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleStatus}
        value={isDisabled}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    // justifyContent: "center",
  },
  normalText: {
    fontSize: 18,
  },
  statusText: {
    fontWeight: "bold",
    fontSize: 16,
    marginRight: 10,
  },
});
