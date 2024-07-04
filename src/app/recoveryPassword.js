import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import { TextInput } from "react-native-gesture-handler";
import { useForm, Controller } from "react-hook-form";
import { api_url } from "../constants/constants";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

export default function RecoveryPassword() {
  const navigation = useNavigation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ defaultValues: { email: "" } });

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(`${api_url}/auth/password/email`, data);
      console.log("enviado: ", response.data);
      setIsModalOpen(true);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        console.log("Erro: ", error.response.data.errors.email[0]);
      } else {
        console.log("Erro: ", error.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      {isModalOpen && (
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text>Pode conferir na caixa de entrada do seu e-mail</Text>
            <Text style={styles.modalText}>
              Foi enviado para seu e-mail as instruções para redefinir sua
              senha.
            </Text>

            <Pressable
              onPress={() => {
                setIsModalOpen(false);
                router.navigate("/");
              }}
              style={styles.navigateButton}
            >
              <Text style={styles.navigateButtonText}>Voltar ao login</Text>
            </Pressable>
          </View>
        </View>
      )}

      <View style={styles.containerRedefinir}>
        <Text style={styles.logoText}>SportReserve</Text>
        <Text style={styles.textRecovery}>Redefinir senha</Text>
        <Text style={styles.textRecovery}>
          Para redefinir sua senha, informe o e-mail cadastrado na sua conta e
          lhe enviaremos um link com as instruções.
        </Text>
        <Controller
          control={control}
          name="email"
          rules={{
            required: "Campo Obrigatório",
            maxLength: { value: 50, message: "O e-mail inserido é inválido" },
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: "O e-mail inserido é inválido",
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Informe o seu e-mail"
              style={styles.inputRecovery}
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
      <Pressable
        onPress={handleSubmit(onSubmit)}
        style={styles.buttonRecuperar}
      >
        <Text style={styles.textButton}>Enviar Link</Text>
      </Pressable>
      <Pressable onPress={() => navigation.navigate("index")}>
        <Text>Voltar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E8F4F8",
  },
  containerRedefinir: {
    alignItems: "center",
  },
  logoText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#3D5A80",
  },
  textRecovery: {
    marginTop: 30,
    textAlign: "center",
  },
  inputRecovery: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 7,
    padding: 10,
    marginVertical: 30,
    width: 320,
    elevation: 5,
    textAlign: "center",
  },
  buttonRecuperar: {
    backgroundColor: "#007BFF",
    paddingVertical: 15,
    paddingHorizontal: 80,
    borderRadius: 10,
    marginVertical: 20,
    elevation: 5,
  },
  textButton: { color: "#fff", fontWeight: "bold" },
  errorMessage: {
    color: "red",
    fontSize: 12,
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 1,
  },
  modal: {
    width: 500,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
    zIndex: 2,
  },
  modalText: {
    marginVertical: 10,
    textAlign: "center",
  },

  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  navigateButton: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  navigateButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
