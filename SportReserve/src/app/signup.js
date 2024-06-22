import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import Checkbox from "expo-checkbox";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Vibration,
} from "react-native";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import api_url from "../constants/constants";
import CpfMask from "../components/CpfMask";
import { CustomPasswordInput } from "../components/CustomInputPassword";

export default function SignUp() {
  const [isChecked, setChecked] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      cpf: "",
    },
  });

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidPassword = (password) => {
    return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/.test(
      password
    );
  };

  const handleSignUp = async (data) => {
    try {
      if (!isValidEmail(data.email)) {
        setError("email", {
          type: "manual",
          message: "Por favor, insira um e-mail válido",
        });
        Vibration.vibrate(300);
        return;
      }

      if (!isValidPassword(data.password)) {
        setError("password", {
          type: "manual",
          message:
            "A senha deve ter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais.",
        });
        Vibration.vibrate(300);
        return;
      }

      if (data.password !== data.confirmPassword) {
        setError("confirmPassword", {
          type: "manual",
          message: "As senhas não conferem.",
        });
        Vibration.vibrate(300);
        return;
      }
      if (!isChecked) {
        Vibration.vibrate(300);
        alert("Você precisa concordar com os Termos e Condições.");
        return;
      }
      const response = await axios.post(`${api_url}/api/register`, data);
      console.log("Cadastro realizado com sucesso:", response);

      Alert.alert("Cadastro realizado com sucesso!");
      setTimeout(() => {
        navigation.navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollViewContainer}
          // keyboardShouldPersistTaps="handled"
          // showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior="automatic"
        >
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>SportReserve</Text>
            <Text style={styles.textLogo}>Cadastre-se</Text>
          </View>

          <View style={styles.inputContainer}>
            <Ionicons
              name="person-outline"
              size={20}
              color="#666"
              style={styles.icon}
            />
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder="Nome Completo"
                  style={styles.input}
                  keyboardType="default"
                  autoCapitalize="words"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.name && (
              <Text style={styles.errorMessage}>{errors.name.message}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Ionicons
              name="id-card-outline"
              size={20}
              color="#666"
              style={styles.icon}
            />
            <Controller
              control={control}
              name="cpf"
              render={({ field: { onChange, onBlur, value } }) => (
                <CpfMask
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.cpf && (
              <Text style={styles.errorMessage}>{errors.cpf.message}</Text>
            )}
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
              name="email"
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
            />
            {errors.email && (
              <Text style={styles.errorMessage}>{errors.email.message}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="#666"
              style={styles.icon}
            />
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <CustomPasswordInput
                  placeholder="Senha"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                />
              )}
            />
            {errors.password && (
              <Text style={styles.errorMessage}>{errors.password.message}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="#666"
              style={styles.icon}
            />
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <CustomPasswordInput
                  placeholder="Confirme a senha"
                  style={styles.input}
                  secureTextEntry
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.confirmPassword && (
              <Text style={styles.errorMessage}>
                {errors.confirmPassword.message}
              </Text>
            )}
          </View>

          <View style={styles.checkBoxContainer}>
            <Checkbox
              value={isChecked}
              onValueChange={setChecked}
              color={isChecked ? "#4630EB" : undefined}
            />
            <Text style={{ fontSize: 16, color: "gray" }}>Concordo com os</Text>
            <Text style={{ fontSize: 16, textDecorationLine: "underline" }}>
              Termos e Condições
            </Text>
          </View>

          <Pressable style={styles.button} onPress={handleSubmit(handleSignUp)}>
            <Text style={styles.buttonText}>Cadastrar</Text>
          </Pressable>

          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>
              Já tem cadastro?{" "}
              <Link href="/">
                <Text style={styles.signupLink}>Faça login</Text>
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
    marginTop: 50,
    fontSize: 32,
    fontWeight: "bold",
    color: "#3D5A80",
  },
  textLogo: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 13,
    fontWeight: "bold",
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
  checkBoxContainer: {
    marginVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
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
