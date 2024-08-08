import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { api_url } from "../../constants/constants";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Pdf() {
    
  const handlePdfUser = async () => {
    try {
      const token = await AsyncStorage.getItem("TOKEN");
      const response = await axios.get(`${api_url}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("resposta do pdf", response.data);
    } catch (error) {
      Alert.alert("Falha ao gerar o PDF dos usuários");
      console.log("erro ao gerar pdf", error);
    }
  };
  return (
    <View>
      <Text>Pdf</Text>
    </View>
  );
}

const styles = StyleSheet.create({});
