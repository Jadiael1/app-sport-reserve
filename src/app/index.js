import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  ActivityIndicator,
  Platform,
  Vibration,
  SafeAreaView,
} from "react-native";
import { Link, useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Controller, useForm } from "react-hook-form";
import { api_url } from "../constants/constants";
import { CustomPasswordInput } from "../components/CustomInputPassword";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login() {
  const navigation = useNavigation();
  const [loginError, setLoginError] = useState("");
  const [loadingLogin, setLoadingLogin] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = async ({ email, password }) => {
    console.log("Tentando fazer o login:", email, password);

    setLoadingLogin(true);

    if (!isValidEmail(email)) {
      setError("email", {
        type: "manual",
        message: "Por favor, insira um e-mail válido",
      });
      Vibration.vibrate(400);
      setLoadingLogin(false);
      return;
    }

    if (!isValidPassword(password)) {
      setError("password", {
        type: "manual",
        message: "Insira a senha",
      });
      Vibration.vibrate(400);
      setLoadingLogin(false);
      return;
    }

    try {
      const response = await axios.post(`${api_url}/auth/signin`, {
        email,
        password,
      });
      AsyncStorage.setItem("TOKEN", response.data.token);
      console.log("resposta do token", response.data.token);
      console.log("Resposta do servidor:", response.data);

      navigation.navigate("home");
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      setLoginError("Verifique suas credenciais, por favor!");
      Vibration.vibrate(400);
    } finally {
      setLoadingLogin(false);
    }
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidPassword = (password) => {
    return password.length > 0;
  };

  // const validateToken = async (token) => {
  //   try {
  //     const response = await axios.post(`${api_url}/auth/user`, {
  //       token,
  //     });
  //     console.log("resposta do token", response);
  //     return response.data.valid;
  //   } catch (error) {
  //     console.error("Erro ao validar token:", error);
  //     return false;
  //   }
  // };
  useEffect(() => {
    AsyncStorage.getItem("TOKEN").then((token) => {
      console.log("token:", token);
    });
  });

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollViewContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>SportReserve</Text>
          </View>

          <View style={styles.inputContainer}>
            <Ionicons
              name="mail-outline"
              size={20}
              color="#666"
              style={styles.icon}
            />
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder="E-mail"
                  style={styles.input}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
              name="email"
              rules={{
                required: {
                  value: true,
                  message: "Insira o e-mail",
                },
              }}
            />
          </View>

          {errors.email && (
            <Text style={styles.errorMessage}>{errors.email.message}</Text>
          )}

          <View style={styles.inputContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="#666"
              style={styles.icon}
            />
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <CustomPasswordInput
                  placeholder="Senha"
                  style={styles.input}
                  secureTextEntry
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
              name="password"
              rules={{
                required: {
                  value: true,
                  message: "Insira a senha",
                },
              }}
            />
          </View>

          {errors.password && (
            <Text style={styles.errorMessage}>{errors.password.message}</Text>
          )}

          {loginError !== "" && (
            <Text style={styles.errorMessage}>{loginError}</Text>
          )}

          <View style={styles.forgotPasswordContainer}>
            <Link href="/recuperar" style={styles.forgotPasswordText}>
              <Text>Esqueceu a senha?</Text>
            </Link>
          </View>

          <Pressable
            style={[styles.button, loadingLogin && styles.buttonLoading]}
            onPress={handleSubmit(handleLogin)}
            disabled={loadingLogin}
          >
            {loadingLogin ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Entrar</Text>
            )}
          </Pressable>

          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>
              Não tem cadastro?{" "}
              <Link href="/signup">
                <Text style={styles.signupLink}>Se cadastre agora!</Text>
              </Link>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8F4F8",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollViewContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  logoContainer: {
    marginBottom: 50,
  },
  logoText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#3D5A80",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 7,
    padding: 10,
    marginVertical: 10,
    width: 320,
    elevation: 5,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  forgotPasswordContainer: {
    width: "100%",
    alignItems: "flex-end",
    marginVertical: 10,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: "#007BFF",
    textDecorationLine: "underline",
  },
  button: {
    backgroundColor: "#3D5A80",
    paddingVertical: 15,
    paddingHorizontal: 80,
    borderRadius: 7,
    marginVertical: 20,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonLoading: {
    opacity: 0.7,
    fontSize: 18,
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  signupText: {
    fontSize: 16,
    color: "gray",
  },
  signupLink: {
    fontWeight: "bold",
    color: "#3D5A80",
  },
  errorMessage: {
    color: "red",
    fontSize: 12,
  },
});
