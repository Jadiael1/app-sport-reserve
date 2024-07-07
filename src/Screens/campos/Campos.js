import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  StyleSheet,
  Alert,
  Modal,
} from "react-native";
import axios from "axios";
import { ValorHora } from "../../components/Inputs/ValorHora";
import { api_url } from "../../constants/constants";
import { AntDesign } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Entypo } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
const Campos = () => {
  const [fields, setFields] = useState([]);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingField, setEditingField] = useState(null);

  useEffect(() => {
    fetchFields();
  }, [fetchFields]);

  const fetchFields = async () => {
    try {
      const response = await axios.get(`${api_url}/fields`);
      if (response.data.status === "success") {
        setFields(response.data.data.data);
        console.log("Lista de campos recebida:", response.data.data);
      } else {
        Alert.alert("Erro", "Não foi possível buscar os campos.");
      }
    } catch (error) {
      console.error("Erro ao buscar campos:", error);
      Alert.alert("Erro", "Não foi possível buscar os campos.");
    }
  };

  const filteredFields = fields.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addField = async () => {
    if (!name || !location || !type || !hourlyRate) {
      Alert.alert("Erro", "Todos os campos são obrigatórios.");
      return;
    }

    try {
      const hourlyRateNumber = parseFloat(
        hourlyRate.replace(",", ".").replace("R$", "")
      );
      const token = await AsyncStorage.getItem("TOKEN");
      const response = await axios.post(
        `${api_url}/fields`,
        {
          name,
          location,
          type,
          hourly_rate: hourlyRateNumber,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === "success") {
        setFields([...fields, response.data.data]);
        console.log("Novo campo adicionado:", response.data.data);
        setName("");
        setLocation("");
        setType("");
        setHourlyRate("");
        setModalOpen(false);
        Alert.alert("Sucesso", "Campo adicionado com sucesso.");
      } else {
        Alert.alert("Erro", "Não foi possível adicionar o campo.");
      }
    } catch (error) {
      console.error("Erro ao adicionar campo:", error);
      Alert.alert("Erro", "Não foi possível adicionar o campo.");
    }
  };

  // Atualizar dados do campo
  const updateField = async () => {
    if (!name || !location || !type || !hourlyRate) {
      Alert.alert("Erro", "Todos os campos são obrigatórios.");
      return;
    }

    try {
      const hourlyRateNumber = parseFloat(
        hourlyRate.replace(",", ".").replace("R$", "")
      );
      const token = await AsyncStorage.getItem("TOKEN");
      if (!token) {
        Alert.alert("Erro", "Token de autenticação não encontrado.");
        return;
      }

      const response = await axios.patch(
        `${api_url}/fields/${editingField.id}`,
        {
          name,
          location,
          type,
          hourly_rate: hourlyRateNumber,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === "success") {
        setFields(
          fields.map((field) =>
            field.id === editingField.id ? response.data.data : field
          )
        );
        console.log("Campo atualizado:", response.data.data);
        setName("");
        setLocation("");
        setType("");
        setHourlyRate("");
        setModalOpen(false);
        setEditingField(null);
        Alert.alert("Sucesso", "Campo atualizado com sucesso.");
      } else {
        Alert.alert("Erro", "Não foi possível atualizar o campo.");
      }
    } catch (error) {
      console.error("Erro ao atualizar campo:", error);
      Alert.alert("Erro", "Não foi possível atualizar o campo.");
    }
  };

  const deleteField = async (fieldId) => {
    Alert.alert(
      "Confirmação",
      "Você tem certeza que deseja excluir este campo?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("TOKEN");
              if (!token) {
                console.log("Token não encontrado");
                return;
              }

              const response = await axios.delete(
                `${api_url}/fields/${fieldId}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              if (response.status === 200) {
                console.log("Campo deletado com sucesso");
                await fetchFields();
              } else {
                console.log("Falha ao deletar o campo", response.data);
              }
            } catch (error) {
              console.log("Erro ao deletar o campo", error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const openEditModal = (field) => {
    setName(field.name);
    setLocation(field.location);
    setType(field.type);
    setHourlyRate(field.hourly_rate.toString());
    setEditingField(field);
    setModalOpen(true);
  };

  const handleSaveField = () => {
    if (editingField) {
      updateField();
    } else {
      addField();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Lista de Campos</Text>

      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Localizar campo..."
          style={styles.searchInput}
          onChangeText={(text) => setSearchQuery(text)}
        />

        <Pressable style={styles.addButton} onPress={() => setModalOpen(true)}>
          <Text style={styles.addButtonText}>Adicionar campo</Text>
        </Pressable>
      </View>

      <FlatList
        style={styles.list}
        data={filteredFields}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.fieldItem}>
            <View style={styles.fieldTextContainer}>
              <Text style={styles.fieldText}>
                Nome: <Text style={styles.descriptionItens}>{item.name}</Text>
              </Text>
              <Text style={styles.fieldText}>
                Localização:{" "}
                <Text style={styles.descriptionItens}>{item.location}</Text>
              </Text>
              <Text style={styles.fieldText}>
                Modalidade:{" "}
                <Text style={styles.descriptionItens}>{item.type}</Text>
              </Text>
              <Text style={styles.fieldText}>
                Valor da Hora:{" "}
                <Text style={styles.descriptionItens}>
                  R$ {item.hourly_rate}
                </Text>
              </Text>
            </View>
            <View style={styles.iconContainer}>
              <Pressable
                style={styles.iconButton}
                onPress={() => openEditModal(item)}
              >
                <Feather name="edit" size={24} color="blue" />
              </Pressable>
              <Pressable
                style={styles.iconButton}
                onPress={() => deleteField(item.id)}
              >
                <Entypo name="trash" size={24} color="#FF0000" />
              </Pressable>
            </View>
          </View>
        )}
      />

      <Modal
        visible={modalOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setModalOpen(false);
          setEditingField(null);
          setName("");
          setLocation("");
          setType("");
          setHourlyRate("");
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingField ? "Editar Campo" : "Adicionar Campo"}
            </Text>
            <TextInput
              placeholder="Nome do campo"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />
            <TextInput
              placeholder="Localização"
              value={location}
              onChangeText={setLocation}
              style={styles.input}
            />
            <TextInput
              placeholder="Modalidade do campo"
              value={type}
              onChangeText={setType}
              style={styles.input}
            />

            <ValorHora
              value={hourlyRate}
              onChangeText={setHourlyRate}
              style={styles.input}
            />

            <View style={styles.modalButtonContainer}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setModalOpen(false);
                  setEditingField(null);
                  setName("");
                  setLocation("");
                  setType("");
                  setHourlyRate("");
                }}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveField}
              >
                <Text style={styles.saveButtonText}>Salvar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
    // backgroundColor: "#fff",
    backgroundColor: "#E8F4F8",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    alignSelf: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginLeft: 10,
  },
  addButton: {
    backgroundColor: "#3D3DDA",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginLeft: 10,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  list: {
    marginTop: 10,
  },
  fieldItem: {
    flexDirection: "row",
    alignItems: "center",

    justifyContent: "space-between",
    backgroundColor: "#fff",

    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },

  fieldTextContainer: {
    flex: 1,
    marginRight: 10,
  },
  fieldText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#3D5A80",
    marginRight: 10,
  },
  iconContainer: {
    flexDirection: "row",
  },
  iconButton: {
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginTop: 10,
    width: "48%",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#ccc",
  },
  cancelButtonText: {
    color: "#000",
  },
  saveButton: {
    backgroundColor: "#3D3DDA",
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  descriptionItens: {
    fontWeight: "bold",
    color: "#000",
  },
});

export default Campos;
