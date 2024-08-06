import React, { useState, useEffect } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  TextInput,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import { api_url } from "../../constants/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import CpfMask from "../Inputs/CpfMask";
import { CustomPasswordInput } from "../Inputs/CustomInputPassword";
import { CellPhoneNumber } from "../Inputs/CellPhoneMask";

const ModalsAdUser = ({ visible, onClose, userToEdit, mode }) => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    cpf: "",
    phone: "",
    password: "",
    password_confirmation: "",
    is_admin: false,
  });
  const [loading, setLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    if (userToEdit) {
      setUser({
        name: userToEdit.name,
        email: userToEdit.email,
        cpf: userToEdit.cpf,
        phone: userToEdit.phone,
        password: "",
        password_confirmation: "",
        is_admin: userToEdit.is_admin ? "admin" : "user",
      });
    } else {
      setUser({
        name: "",
        email: "",
        cpf: "",
        phone: "",
        password: "",
        password_confirmation: "",
        is_admin: "user",
      });
    }
  }, [userToEdit]);

  const clearCpfFormat = (cpf) => {
    return cpf.replace(/\.|-/g, "");
  };

  const handleChange = (name, value) => {
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
    setHasUnsavedChanges(true);
  };

  const handleSaveUser = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("TOKEN");
      const cleanedCpf = clearCpfFormat(user.cpf);

      if (mode === "edit") {
        // Editar usuário existente
        const response = await axios.patch(
          `${api_url}/users/${userToEdit.id}`,
          {
            ...user,
            cpf: cleanedCpf,
            is_admin: user.is_admin === "admin",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Resposta da edição", response.data.data);
      } else {
        // Adicionar novo usuário
        const response = await axios.post(
          `${api_url}/users`,
          {
            ...user,
            cpf: cleanedCpf,
            is_admin: user.is_admin === "admin",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Resposta do cadastro", response.data.data);
      }

      setUser({
        name: "",
        email: "",
        cpf: "",
        phone: "",
        password: "",
        password_confirmation: "",
        is_admin: "",
      });
      onClose();
    } catch (error) {
      console.log("Erro ao salvar usuário", error);
      Alert.alert("Erro ao salvar usuário", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    const hasUnsavedChanges =
      user.name ||
      user.email ||
      user.cpf ||
      user.phone ||
      user.password ||
      user.password_confirmation ||
      user.is_admin;

    if (hasUnsavedChanges) {
      Alert.alert(
        "Sair sem salvar?",
        "Você tem mudanças não salvas. Tem certeza de que deseja sair?",
        [
          {
            text: "Não",
            style: "cancel",
          },
          {
            text: "Sim",
            onPress: () => {
              setUser({
                name: "",
                email: "",
                cpf: "",
                phone: "",
                password: "",
                password_confirmation: "",
                is_admin: "",
              });
              onClose();
            },
          },
        ]
      );
    } else {
      onClose();
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Pressable onPress={handleClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="black" />
          </Pressable>
          <Text style={styles.title}>
            {mode === "edit" ? "Editar Usuário" : "Cadastrar Usuário"}
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Nome"
            value={user.name}
            onChangeText={(text) => handleChange("name", text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={user.email}
            onChangeText={(text) => handleChange("email", text)}
            inputMode="email-address"
          />

          <CpfMask
            value={user.cpf}
            style={styles.input}
            onChangeText={(text) => handleChange("cpf", text)}
            inputMode="numeric"
          />
          <CellPhoneNumber
            style={styles.input}
            placeholder="Telefone"
            value={user.phone}
            onChangeText={(text) => handleChange("phone", text)}
            inputMode="phone-pad"
          />

          <CustomPasswordInput
            style={styles.input}
            placeholder="Senha"
            value={user.password}
            onChangeText={(text) => handleChange("password", text)}
            secureTextEntry
          />

          <CustomPasswordInput
            style={styles.input}
            placeholder="Confirmação de Senha"
            value={user.password_confirmation}
            onChangeText={(text) => handleChange("password_confirmation", text)}
            secureTextEntry
          />
          <Picker
            selectedValue={user.is_admin}
            style={styles.picker}
            onValueChange={(itemValue) => handleChange("is_admin", itemValue)}
          >
            <Picker.Item
              label="Selecione o tipo de usuário"
              value=""
              enabled={false}
            />
            <Picker.Item label="Usuário" value="user" />
            <Picker.Item label="Administrador" value="admin" />
          </Picker>

          <View style={styles.buttonContainer}>
            <Pressable style={styles.button} onPress={handleSaveUser}>
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.buttonText}>
                  {mode === "edit" ? "Salvar" : "Cadastrar"}
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modal: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 10,
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  picker: {
    height: 50,
    width: "100%",
    borderWidth: 1,
    marginBottom: 10,
  },
  buttonContainer: {
    marginTop: 10,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});

export default ModalsAdUser;
