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
      // Verificar e ajustar imagens
      const validImages = images.filter((image) => {
        const allowedTypes = ["image/jpeg", "image/png"];
        return allowedTypes.includes(image.type);
      });
      console.log(validImages);
      if (validImages.length !== images.length) {
        Alert.alert(
          "Erro",
          "Todos os arquivos devem ser imagens com tipo: jpg, jpeg, png."
        );
        return;
      }

      console.log("Imagens válidas:", validImages);

      const hourlyRateNumber = parseFloat(
        hourlyRate.replace(",", ".").replace("R$", "")
      );
      const token = await AsyncStorage.getItem("TOKEN");
      console.log("Token:", token);

      const formData = new FormData();
      formData.append("name", name);
      formData.append("location", location);
      formData.append("type", type);
      formData.append("hourly_rate", hourlyRate);

      validImages.forEach((image, index) => {
        formData.append(`images[${index}]`, {
          uri: image.uri,
          type: image.type,
          name: `image${index}.${image.type.split("/")[1]}`,
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

      if (response.status === 200 || response.status === 201) {
        console.log("Campo salvo com sucesso:", response.data.data);
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
    try {
      const token = await AsyncStorage.getItem("TOKEN");
      const response = await axios.delete(`${api_url}/fields/${fieldId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        Alert.alert("Sucesso", "Campo deletado com sucesso");
        await fetchFields();
      } else {
        console.error("Falha ao deletar o campo", response.data);
      }
    } catch (error) {
      console.error("Erro ao deletar o campo", error);
    }
  };

  const openEditModal = (field) => {
    setName(field.name);
    setLocation(field.location);
    setType(field.type);
    setHourlyRate(field.hourly_rate.toString());
    setEditingField(field);
    setImages(
      field.images.map((image) => ({
        ...image,
        uri: `${api_url}/${image.path}`.replace("api/v1/", "public/"),
      })) || []
    );
    setModalOpen(true);
  };

  const openCreateModal = () => {
    setName("");
    setLocation("");
    setType("");
    setHourlyRate("");
    setImages([]);
    setEditingField(null);
    setModalOpen(true);
  };

  const pickImage = async () => {
    if (images.length >= 5) {
      Alert.alert("Erro", "Você só pode adicionar no máximo 5 imagens.");
      return;
    }

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
        autoPlayInterval={3000}
        data={item.images || []}
        renderItem={({ item: image }) => {
          const imageUrl = `${api_url}/${image.path}`.replace(
            "api/v1/",
            "public/"
          );
          return (
            <Pressable
              onPress={() => setSelectedImage(imageUrl)}
              style={styles.imageContainer}
            >
              <Image
                source={{ uri: imageUrl }}
                style={styles.carouselImage}
                onError={() => handleImageError(image.id)}
              />
            </Pressable>
          );
        }}
        width={width - 40}
        height={160}
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
          <AntDesign name="edit" size={24} color="#007BFF" />
        </Pressable>
        <Pressable
          style={styles.iconButton}
          onPress={() => deleteField(item.id)}
        >
          <AntDesign name="delete" size={24} color="#FF0000" />
        </Pressable>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Minhas arenas</Text>

      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Buscar arena..."
          style={styles.searchInput}
          onChangeText={setSearchQuery}
        />
        <Pressable style={styles.addButton} onPress={openCreateModal}>
          <AntDesign name="plus" size={24} color="#FFF" />
          <Text style={styles.addButtonText}>Adicionar arena</Text>
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
        transparent={true}
        animationType="slide"
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
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setModalOpen(false);
                setEditingField(null);
                setName("");
                setLocation("");
                setType("");
                setHourlyRate("");
                setImages([]);
              }}
            >
              <AntDesign name="close" size={24} color="#007BFF" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {editingField ? "Editar" : "Adicionar"} Campo
            </Text>

            <ScrollView>
              <TextInput
                placeholder="Nome"
                style={styles.input}
                value={name}
                onChangeText={setName}
              />
              <TextInput
                placeholder="Localização"
                style={styles.input}
                value={location}
                onChangeText={setLocation}
              />
              <TextInput
                placeholder="Modalidade"
                style={styles.input}
                value={type}
                onChangeText={setType}
              />
              <ValorHora
                placeholder="Valor da Hora"
                style={styles.input}
                value={hourlyRate}
                onChangeText={setHourlyRate}
              />

              <Text style={styles.sectionTitle}>Imagens</Text>
              <View style={styles.imageList}>
                {images.map((image, index) => (
                  <View key={index} style={styles.imageWrapper}>
                    <Image
                      source={{ uri: image.uri }}
                      style={styles.image}
                      resizeMode="cover"
                    />
                    <TouchableOpacity
                      style={styles.removeImageButton}
                      onPress={() => removeImage(index)}
                    >
                      <AntDesign name="close" size={20} color="#FFF" />
                    </TouchableOpacity>
                  </View>
                ))}
                {images.length < 5 && (
                  <TouchableOpacity
                    style={styles.uploadButton}
                    onPress={pickImage}
                  >
                    <AntDesign name="camerao" size={30} color="#007BFF" />
                  </TouchableOpacity>
                )}
              </View>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveField}
              >
                <Text style={styles.saveButtonText}>
                  {editingField ? "Salvar Alterações" : "Adicionar Campo"}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {selectedImage && (
        <Modal visible={true} transparent={true}>
          <TouchableOpacity
            style={styles.imagePreviewContainer}
            onPress={() => setSelectedImage(null)}
          >
            <View style={styles.imagePreviewWrapper}>
              <Image
                source={{ uri: selectedImage }}
                style={styles.imagePreview}
                resizeMode="contain"
              />
              <TouchableOpacity
                style={styles.closePreviewButton}
                onPress={() => setSelectedImage(null)}
              >
                <AntDesign name="close" size={30} color="#FFF" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: "#ced4da",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    backgroundColor: "#fff",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 8,
    marginLeft: 8,
  },
  addButtonText: {
    color: "#fff",
    marginLeft: 8,
  },
  list: {
    flex: 1,
  },
  fieldItem: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  fieldTextContainer: {
    marginVertical: 16,
  },
  fieldText: {
    fontSize: 16,
    marginBottom: 4,
    color: "#333",
  },
  fieldLabel: {
    fontWeight: "bold",
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
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
  },
  closeButton: {
    alignSelf: "flex-end",
  },
  closeButtonText: {
    fontSize: 24,
    color: "#007BFF",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: "#ced4da",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  imageList: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  imageWrapper: {
    position: "relative",
    marginBottom: 8,
    marginRight: 8,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ced4da",
  },
  removeImageButton: {
    position: "absolute",
    top: -8,
    right: -6,
    backgroundColor: "#000",
    borderRadius: 12,
    padding: 2,
  },
  uploadButton: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ced4da",
    justifyContent: "center",
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: "#007BFF",
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  imagePreviewContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  imagePreviewWrapper: {
    position: "relative",
    width: "90%",
    height: "90%",
  },
  imagePreview: {
    width: "100%",
    height: "100%",
  },
  closePreviewButton: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "#000",
    borderRadius: 24,
    padding: 8,
  },
  imageContainer: {
    alignItems: "center",
  },
  carouselImage: {
    width: "100%",
    height: 160,
    borderRadius: 8,
    resizeMode: "cover",
  },
});

export default Campos;
