import * as WebBrowser from "expo-web-browser";
import axios from "axios";
import { api_url } from "../constants/constants";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Campos
export const fetchFields = async () => {
  try {
    const response = await axios.get(`${api_url}/fields`);

    if (response.data.status === "success") {
      return response.data.data.data;
    } else {
      throw new Error("Erro ao buscar campos");
    }
  } catch (error) {
    console.error("Erro ao buscar campos:", error);
    throw error;
  }
};
// Horários
export const fetchHorarios = async () => {
  try {
    const token = await AsyncStorage.getItem("TOKEN");
    const response = await axios.get(`${api_url}/reservations`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.status === "success") {
      const isAdmin = await AsyncStorage.getItem("IS_ADMIN");
      const horarios = response.data.data.data.map((horario) => {
        const enhancedHorario = {
          ...horario,
          // Adicionar userName apenas se o usuário for admin
          userName: isAdmin === "1" ? horario.user.name : null,
        };
        return enhancedHorario;
      });

      return horarios;
    } else {
      throw new Error("Erro ao buscar os agendamentos");
    }
  } catch (error) {
    console.log("Erro ao resgatar os horários agendados", error);
    throw error;
  }
};

// Nome do campo
export const fetchFieldName = async (field_id) => {
  try {
    const response = await axios.get(`${api_url}/fields/${field_id}`);

    if (response.data.status === "success") {
      return response.data.data.name;
    } else {
      throw new Error("Erro ao buscar o nome do campo");
    }
  } catch (error) {
    console.error("Erro ao buscar o nome do campo:", error);
    throw error;
  }
};

// Pagamentos
export const SwitchPagamentos = async (reserveId) => {
  try {
    const token = await AsyncStorage.getItem("TOKEN");
    if (!token) {
      throw new Error("Token não encontrado");
    }

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
    WebBrowser.openBrowserAsync(paymentUrl);

    console.log("Resposta do pagamento:", response.data);
  } catch (error) {
    console.log("Erro ao redirecionar para pagamento:", error);
    if (error.response && error.response.status === 401) {
      Alert.alert(
        "Erro de autenticação",
        "Sua sessão expirou. Faça login novamente para continuar."
      );
    } else {
      Alert.alert(
        "Erro",
        "Não foi possível redirecionar para a página de pagamento."
      );
    }
  }
};
