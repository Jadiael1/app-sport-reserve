import React, { createContext, useReducer, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { api_url } from "../constants/constants";
import { useNavigation } from "@react-navigation/native";

const AuthContext = createContext();

export const useSession = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};

const initialState = {
  session: null,
  isLoading: false,
  error: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case "SIGN_IN":
      return {
        ...state,
        session: action.payload,
        isLoading: false,
        error: null,
      };
    case "SIGN_OUT":
      return { ...state, session: null, isLoading: false, error: null };
    case "SET_ERROR":
      return { ...state, error: action.payload, isLoading: false };
    case "CLEAR_ERROR":
      return { ...state, error: null };
    case "SET_LOADING":
      return { ...state, isLoading: true };
    case "STOP_LOADING":
      return { ...state, isLoading: false };
    default:
      return state;
  }
};

export const SessionProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const navigation = useNavigation();

  const checkTokenExpiration = async () => {
    try {
      const token = await AsyncStorage.getItem("TOKEN");
      const isAdmin =
        JSON.parse(await AsyncStorage.getItem("IS_ADMIN")) || false;

      if (token) {
        dispatch({ type: "SIGN_IN", payload: { token, isAdmin } });
      }
    } catch (error) {
      console.error("Error checking token or admin status", error);
      navigation.navigate("index");
    }
  };

  const signIn = async (email, password) => {
    dispatch({ type: "SET_LOADING" });
    try {
      const response = await axios.post(`${api_url}/auth/signin`, {
        email,
        password,
      });
      const { token, user } = response.data.data;

      if (token && user?.is_admin !== undefined) {
        await AsyncStorage.setItem("TOKEN", token);
        await AsyncStorage.setItem("IS_ADMIN", JSON.stringify(user.is_admin));
        dispatch({
          type: "SIGN_IN",
          payload: { token, isAdmin: user.is_admin },
        });
        navigation.navigate("home");
      } else {
        throw new Error("Token or is_admin not found in response");
      }
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: error.response?.data || "Error signing in",
      });
    }
  };

  const signOut = async () => {
    await AsyncStorage.removeItem("TOKEN");
    await AsyncStorage.removeItem("IS_ADMIN");
    dispatch({ type: "SIGN_OUT" });
    navigation.navigate("index"); // Navegar para a tela de login ou similar
  };

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        session: state.session,
        isAdmin: state.session?.isAdmin,
        isLoading: state.isLoading,
        error: state.error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
