import React, { useState, useContext } from "react";
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
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Controller, useForm } from "react-hook-form";
import { CustomPasswordInput } from "../components/Inputs/CustomInputPassword";
import { useSession } from "../context/UserContext";



export default function Login() {
  const { signIn, error } = useSession();
  const navigation = useNavigation();
  const [loginError, setLoginError] = useState("");
  const [loadingLogin, setLoadingLogin] = useState(false);
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
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
    try {
      await signIn(email, password);
    } catch (error) {
      setLoginError(error.message || "Erro desconhecido");
      throw error;
    }
  };

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isValidPassword = (password) => password.length > 0;

  const renderForm = () => (
    <View>
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
              inputMode="email-address"
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
        <Pressable onPress={() => navigation.navigate("recoveryPassword")}>
          <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
        </Pressable>
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
          <Pressable onPress={() => navigation.navigate("signup")}>
            <Text style={styles.signupLink}>Se cadastre agora!</Text>
          </Pressable>
        </Text>
      </View>
    </View>
  );

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
            <Text style={styles.logoText}>
              Sport<Text style={styles.textReserve}>Reserve</Text>
            </Text>
          </View>

          {Platform.OS === "web" ? (
            <form onSubmit={handleSubmit(handleLogin)}>{renderForm()}</form>
          ) : (
            renderForm()
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8F4F8",
    paddingTop: 50,
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
    fontSize: 50,
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
    // width: "100%",
    alignItems: "flex-end",
    justifyContent: "end",
    marginVertical: 10,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: "#007BFF",
    textDecorationLine: "underline",
    fontFamily: "PoppinsReg",
  },
  button: {
    backgroundColor: "#3D5A80",
    paddingVertical: 15,
    // paddingHorizontal: 80,
    borderRadius: 7,
    marginVertical: 20,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",

    textAlign: "center",
  },
  buttonLoading: {
    opacity: 0.7,
  },
  signupContainer: {
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  signupText: {
    fontSize: 16,
    color: "gray",
    marginTop: 80,

    // alignItems: "center",
    // justifyContent: "center",
    // backgroundColor: "blue",
  },
  signupLink: {
    fontWeight: "bold",
    color: "#3D5A80",
  },
  errorMessage: {
    color: "red",
    fontSize: 12,
  },
  textReserve: {
    color: "#007BFF",
  },
});
