import axios from "axios";
import { useState, useEffect } from "react";
import { api_url } from "../constants/constants";

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.post(`${api_url}/auth/user`);

        const isAuthenticated = response.data.isAuthenticated;
        setIsAuthenticated(isAuthenticated);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
        setIsAuthenticated(false);
        setLoading(false);
      }
    };

    checkAuth();
  }, [api_url]);

  return { isAuthenticated, loading };
};

export default useAuth;
