import axios from "axios";
import { api_url } from "../constants/constants";

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
