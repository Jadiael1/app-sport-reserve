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
  Image,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { ValorHora } from "../../components/Inputs/ValorHora";
import { api_url } from "../../constants/constants";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Carousel from "@kaceycleveland/react-native-reanimated-carousel";
import * as ImagePicker from "expo-image-picker";
import { Button as RNButton, Icon } from "react-native-elements";
import { AntDesign } from "@expo/vector-icons";

const fallbackImage = "https://placehold.co/600x400";
const { width } = Dimensions.get("window");

const Campos = () => {
  const [fields, setFields] = useState([]);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchFields();
  }, []);

  const fetchFields = async () => {
    try {
      const response = await axios.get(`${api_url}/fields`);
      const fields = response.data.data.data;
      setFields(fields);
    } catch (error) {
      console.error("Erro ao buscar campos:", error);
      Alert.alert("Erro", "Não foi possível buscar os campos.");
    }
  };

  const filteredFields = fields.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSaveField = async () => {
    if (!name || !location || !type || !hourlyRate) {
      Alert.alert("Erro", "Todos os campos são obrigatórios.");
      return;
    }

    try {
      const hourlyRateNumber = parseFloat(
        hourlyRate.replace(",", ".").replace("R$", "")
      );
      const token = await AsyncStorage.getItem("TOKEN");
      const formData = new FormData();
      formData.append("name", name);
      formData.append("location", location);
      formData.append("type", type);
      formData.append("hourly_rate", hourlyRateNumber);
      images.forEach((image, index) => {
        formData.append(`images[${index}]`, {
          uri: image.uri,
          type: "image/jpeg",
          name: `image${index}.jpg`,
        });
      });

      const url = editingField
        ? `${api_url}/fields/${editingField.id}`
        : `${api_url}/fields`;
      const method = editingField ? "patch" : "post";
      const response = await axios[method](url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.status === "success") {
        setFields(
          editingField
            ? fields.map((field) =>
                field.id === editingField.id ? response.data.data : field
              )
            : [...fields, response.data.data]
        );
        setName("");
        setLocation("");
        setType("");
        setHourlyRate("");
        setImages([]);
        setModalOpen(false);
        setEditingField(null);
        Alert.alert(
          "Sucesso",
          `Campo ${editingField ? "atualizado" : "adicionado"} com sucesso.`
        );
      } else {
        Alert.alert("Erro", "Não foi possível salvar o campo.");
      }
    } catch (error) {
      console.error("Erro ao salvar campo:", error);
      Alert.alert("Erro", "Não foi possível salvar o campo.");
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
              const response = await axios.delete(
                `${api_url}/fields/${fieldId}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              if (response.status === 200) {
                Alert.alert("Sucesso", "Campo deletado com sucesso");
                await fetchFields();
              } else {
                console.error("Falha ao deletar o campo", response.data);
              }
            } catch (error) {
              console.error("Erro ao deletar o campo", error);
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
    setImages(field.images || []);
    setModalOpen(true);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImages((prevImages) => [...prevImages, result.assets[0]]);
    }
  };

  const removeImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const renderItem = ({ item }) => (
    <View style={styles.fieldItem}>
      <Carousel
        autoPlay
        data={item.images || []}
        renderItem={({ item: image }) => {
          const imageUrl = `${api_url}/${image.path}`.replace(
            "api/v1/",
            "public/"
          );
          return (
            <TouchableOpacity
              onPress={() => setSelectedImage(imageUrl)}
              style={styles.imageContainer}
            >
              <Image
                source={{ uri: imageUrl }}
                style={styles.image}
                onError={() => handleImageError(image.id)}
              />
            </TouchableOpacity>
          );
        }}
        width={width - 40}
        height={200}
        style={styles.imageContainer}
        loop
      />
      <View style={styles.fieldTextContainer}>
        <Text style={styles.fieldText}>
          <Text style={styles.fieldLabel}>Nome:</Text> {item.name}
        </Text>
        <Text style={styles.fieldText}>
          <Text style={styles.fieldLabel}>Localização:</Text> {item.location}
        </Text>
        <Text style={styles.fieldText}>
          <Text style={styles.fieldLabel}>Modalidade:</Text> {item.type}
        </Text>
        <Text style={styles.fieldText}>
          <Text style={styles.fieldLabel}>Valor da Hora:</Text> R${" "}
          {item.hourly_rate}
        </Text>
      </View>
      <View style={styles.iconContainer}>
        <Pressable
          style={styles.iconButton}
          onPress={() => openEditModal(item)}
        >
          <Icon name="edit" type="feather" color="#007BFF" />
        </Pressable>
        <Pressable
          style={styles.iconButton}
          onPress={() => deleteField(item.id)}
        >
          <Icon name="trash" type="feather" color="#FF0000" />
        </Pressable>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Campos</Text>

      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Buscar campo..."
          style={styles.searchInput}
          onChangeText={setSearchQuery}
        />
        <Pressable style={styles.addButton} onPress={() => setModalOpen(true)}>
          <Text style={styles.addButtonText}>Adicionar Campo</Text>
        </Pressable>
      </View>

      <FlatList
        style={styles.list}
        data={filteredFields}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />

      <Modal
        visible={modalOpen}
        animationType="slide"
        transparent
        onRequestClose={() => {
          setModalOpen(false);
          setEditingField(null);
          setName("");
          setLocation("");
          setType("");
          setHourlyRate("");
          setImages([]);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Pressable
              style={styles.closeButton}
              onPress={() => setModalOpen(false)}
            >
              <Text style={styles.closeButtonText}>×</Text>
            </Pressable>
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
              placeholder="Modalidade"
              value={type}
              onChangeText={setType}
              style={styles.input}
            />
            <ValorHora
              value={hourlyRate}
              onChange={setHourlyRate}
              style={styles.input}
            />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.imagesContainer}
            >
              {images.map((image, index) => (
                <Pressable
                  key={index}
                  onPress={() => setSelectedImage(image.uri)}
                  style={styles.imagePreview}
                >
                  <Image source={{ uri: image.uri }} style={styles.image} />
                  <Pressable
                    style={styles.removeImageButton}
                    onPress={() => removeImage(index)}
                  >
                    <Text style={styles.removeImageText}>×</Text>
                  </Pressable>
                </Pressable>
              ))}
            </ScrollView>
            <RNButton
              title="Escolher Imagens"
              onPress={pickImage}
              icon={<Icon name="image" type="feather" color="#fff" />}
              buttonStyle={styles.uploadButton}
            />
            <Pressable style={styles.saveButton} onPress={handleSaveField}>
              <Text style={styles.saveButtonText}>
                {editingField ? "Atualizar Campo" : "Adicionar Campo"}
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Modal para imagem ampliada */}
      <Modal
        visible={!!selectedImage}
        transparent
        onRequestClose={() => setSelectedImage(null)}
      >
        <View style={styles.imageModalContainer}>
          <Image source={{ uri: selectedImage }} style={styles.imageModal} />
          <Pressable
            style={styles.imageCloseButton}
            onPress={() => setSelectedImage(null)}
          >
            <Text style={styles.imageCloseButtonText}>
              <AntDesign name="closecircle" size={36} color="#fff" />
            </Text>
          </Pressable>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F0F0",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    marginBottom: 20,
    color: "#333",
  },
  searchContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    borderColor: "#E0E0E0",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#FFF",
  },
  addButton: {
    backgroundColor: "#007BFF",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "#FFF",
    fontSize: 16,
  },
  list: {
    flex: 1,
  },
  fieldItem: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    marginBottom: 15,
    padding: 15,
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  image: {
    width: width - 40,
    height: 200,
    borderRadius: 8,
    resizeMode: "cover",
  },
  imageContainer: {
    marginBottom: 15,
  },
  fieldTextContainer: {
    marginBottom: 10,
  },
  fieldText: {
    fontSize: 16,
    color: "#333",
  },
  fieldLabel: {
    fontWeight: "500",
    color: "#555",
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  iconButton: {
    padding: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 8,
    width: "90%",
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#F8F8F8",
    borderRadius: 50,
    // padding: 5,
  },
  closeButtonText: {
    fontSize: 36,
    color: "#333",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 15,
    color: "#333",
  },
  input: {
    borderColor: "#E0E0E0",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "#FFF",
  },
  saveButton: {
    backgroundColor: "#28a745",
    borderRadius: 8,
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  saveButtonText: {
    color: "#FFF",
    fontSize: 16,
  },
  imagesContainer: {
    marginVertical: 15,
  },
  imagePreview: {
    position: "relative",
    marginRight: 10,
  },
  removeImageButton: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "#FF0000",
    borderRadius: 12,
    padding: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  removeImageText: {
    color: "#FFF",
    fontSize: 16,
  },
  uploadButton: {
    backgroundColor: "#007BFF",
    borderRadius: 8,
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  imageModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  imageModal: {
    width: "90%",
    height: "80%",
    resizeMode: "contain",
  },
  imageCloseButton: {
    position: "absolute",
    top: 20,
    right: 10,
    // backgroundColor: "#000",
    borderRadius: 50,
    padding: 5,
  },
  imageCloseButtonText: {
    fontSize: 24,
    color: "#333",
  },
});

export default Campos;
