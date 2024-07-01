import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import axios from "axios";
import { ValorHora } from "../../components/Inputs/ValorHora";
import { api_url } from "../../constants/constants";
import { AntDesign } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'

const Campos = () => {
  const [fields, setFields] = useState([]);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchFields();
  }, []);

  // Listar todos os campos
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

  // Filtrar campos com base na busca
  const filteredFields = fields.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Adicionar campo
  const addField = async () => {
    if (!name || !location || !type || !hourlyRate) {
      Alert.alert("Erro", "Todos os campos são obrigatórios.");
      return;
    }

    try {
      const hourlyRateNumber = parseFloat(hourlyRate.replace(",", "."));

      const response = await axios.post(`${api_url}/fields`, {
        name,
        location,
        type,
        hourly_rate: hourlyRateNumber,
      });

      if (response.data.status === "success") {
        setFields([...fields, response.data.data]);
        console.log("Novo campo adicionado:", response.data.data);
        setName("");
        setLocation("");
        setType("");
        setHourlyRate("");
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
  const updateFields = () => {
    console.log("atualizar campo");
  };

  // Deletar dados do campo
  const deleteField = () => {
    console.log("deletar campo");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Localizar campo..."
          style={styles.searchInput}
          onChangeText={(text) => setSearchQuery(text)}
        />
        <FontAwesome5
          name="search"
          size={24}
          color="black"
          style={styles.searchIcon}
        />
      </View>
      <View>
        <Text style={styles.title}>Campos</Text>
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
                    {item.hourly_rate}
                  </Text>
                </Text>
              </View>
              <View style={styles.iconContainer}>
                <Pressable style={styles.iconButton} onPress={updateFields}>
                  <AntDesign name="edit" size={24} color="blue" />
                </Pressable>
                <Pressable style={styles.iconButton} onPress={deleteField}>
                  <AntDesign name="delete" size={24} color="red" />
                </Pressable>
              </View>
            </View>
          )}
        />

        <View style={styles.inputContainer}>
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
            placeholder="Valor da hora"
            value={hourlyRate}
            onChangeText={setHourlyRate}
            style={styles.input}
            keyboardType="numeric"
          />
          <Pressable style={styles.button} onPress={addField}>
            <Text style={styles.buttonText}>Adicionar Campo</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8F4F8",
    padding: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    padding: 8,
  },
  searchIcon: {
    marginLeft: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#3D5A80",
    marginBottom: 16,
    textAlign: "center",
  },
  fieldItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
    elevation: 5,
  },
  fieldTextContainer: {
    flex: 1,
  },
  fieldText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
  },
  descriptionItens: {
    color: "red",
  },
  iconContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconButton: {
    marginLeft: 8,
    marginBottom: 5,
  },
  inputContainer: {
    marginTop: 16,
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    fontSize: 16,
    elevation: 5,
  },
  button: {
    backgroundColor: "#3D5A80",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Campos;
