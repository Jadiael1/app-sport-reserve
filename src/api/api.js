import { useSession } from "../context/UserContext";
import * as WebBrowser from "expo-web-browser";
import axios from "axios";
import { api_url } from "../constants/constants";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const fetchUser = async (setUser, session, signOut, router) => {
  try {
    if (!session) {
      router.navigate("index");
      return;
    }

    const response = await axios.get(`${api_url}/auth/user`, {
      headers: {
        Authorization: `Bearer ${session}`,
      },
    });

    const userData = response.data;
    setUser(userData);
  } catch (error) {
    console.log("error", error);
    if (error.response && error.response.status === 401) {
      signOut();
    }
  }
};

// Campos
export const fetchFields = async (session, signOut) => {
  try {
    const response = await axios.get(`${api_url}/fields`, {
      headers: {
        Authorization: `Bearer ${session}`,
      },
    });

    if (response.data.status === "success") {
      return response.data.data.data;
    } else {
      throw new Error("Erro ao buscar campos");
    }
  } catch (error) {
    console.error("Erro ao buscar campos:", error);
    if (error.response && error.response.status === 401) {
      signOut();
    }
    throw error;
  }
};

// Horários
export const fetchHorarios = async () => {
  const { session, signOut } = useSession();

  try {
    const response = await axios.get(`${api_url}/reservations`, {
      headers: {
        Authorization: `Bearer ${session?.token}`,
      },
    });

    if (response.data.status === "success") {
      const isAdmin = await AsyncStorage.getItem("IS_ADMIN");
      const horarios = response.data.data.data.map((horario) => {
        const enhancedHorario = {
          ...horario,
          userName: isAdmin === "1" ? horario.user.name : null,
        };
        return enhancedHorario;
      });

      return horarios;
    } else {
      throw new Error("Erro ao buscar os agendamentos");
    }
  } catch (error) {
    console.error("Erro ao resgatar os horários agendados", error);
    if (error.response && error.response.status === 401) {
      signOut();
    }
    throw error;
  }
};
// Nome do campo
export const fetchFieldName = async (field_id, session, signOut) => {
  try {
    const response = await axios.get(`${api_url}/fields/${field_id}`, {
      headers: {
        Authorization: `Bearer ${session}`,
      },
    });

    if (response.data.status === "success") {
      return response.data.data.name;
    } else {
      throw new Error("Erro ao buscar o nome do campo");
    }
  } catch (error) {
    console.error("Erro ao buscar o nome do campo:", error);
    if (error.response && error.response.status === 401) {
      signOut();
    }
    throw error;
  }
};

// Pagamentos
export const SwitchPagamentos = async (reserveId, session, signOut) => {
  try {
    if (!session) {
      throw new Error("Token não encontrado");
    }

    const response = await axios.post(
      `${api_url}/payments/reservations/${reserveId}/pay`,
      {},
      {
        headers: {
          Authorization: `Bearer ${session}`,
        },
      }
    );

    const paymentUrl = response.data.data.url;
    WebBrowser.openBrowserAsync(paymentUrl);
  } catch (error) {
    console.log("Erro ao redirecionar para pagamento:", error);
    if (error.response && error.response.status === 401) {
      signOut();
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
