import axios from "axios";
import { api_url } from "../constants/constants";
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
    console.log("resposta do fetchHorarios", response.data.data.data);
    horarios = response.data.data.data;
    horarios.forEach((horario) => {
      console.log("id do usuário", horario.user_id);
      // console.log("usuario", user.name);
    });
    if (response.data.status === "success") {
      console.log("resposta dos horários", response.data.data.data);
      return response.data.data.data;
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
    const response = await axios.get(
      `${api_url}/payments/reservations/${reserveId}/pay`
    );
    const paymentUrl = response.data.data.url;
    WebBrowser.openBrowserAsync(paymentUrl);

    // await notifyPayment(response.data.data.id, "paid");
    console.log("pagamento", notifyPayment);
  } catch (error) {
    console.log("Erro ao redirecionar para pagamento:", error);
    Alert.alert(
      "Erro",
      "Não foi possível redirecionar para a página de pagamento."
    );
  }
};

