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
  ActivityIndicator,
  Platform,
} from "react-native";
import axios from "axios";
import { ValorHora } from "../../components/Inputs/ValorHora";
import { api_url } from "../../constants/constants";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Carousel from "@kaceycleveland/react-native-reanimated-carousel";
import * as ImagePicker from "expo-image-picker";
import { AntDesign } from "@expo/vector-icons";
import { DisableButton } from "../../components/buttons/DisableButton";

// const fallbackImage = "https://placehold.co/600x400";
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
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("inactive");

  useEffect(() => {
    fetchFields();
  }, []);

  const fetchFields = async () => {
    try {
      const response = await axios.get(`${api_url}/fields`, {
        params: {
          status: "all",
        },
      });
      const fields = response.data.data.data;
      setFields(fields);
    } catch (error) {
      console.error("Erro ao buscar campos:", error);
      Alert.alert("Erro", "Não foi possível buscar os campos.");
    }
  };

  const filteredFields = fields.filter(
    (field) =>
      field.name && field.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pickImage = async () => {
    if (images.length >= 5) {
      Alert.alert("Erro", "Você só pode adicionar no máximo 5 imagens.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      selectionLimit: 5,
    });

    if (!result.canceled) {
      const newImage = result.assets[0];
      setImages((prevImages) => [...prevImages, newImage]);
    }
  };

  const base64ToBlob = (base64, mimeType) => {
    const byteCharacters = atob(base64);
    const byteArrays = Array(Math.ceil(byteCharacters.length / 512))
      .fill()
      .map((_, index) => {
        const slice = byteCharacters.slice(index * 512, (index + 1) * 512);
        return new Uint8Array([...slice].map((char) => char.charCodeAt(0)));
      });
    return new Blob(byteArrays, { type: mimeType });
  };

  const handleCreateField = async () => {
    setLoading(true);
    const formattedHourlyRate = (hourlyRate || "")
      .toString()
      .replace(/[^\d.-]/g, "");
    const formData = new FormData();
    formData.append("name", name);
    formData.append("location", location);
    formData.append("type", type);
    formData.append("hourly_rate", parseFloat(formattedHourlyRate));

    if (images.length > 0) {
      images.forEach((image) => {
        const { uri, filename, mimeType } = image;
        const base64Data = uri.split("base64,")[1];
        const blob = base64ToBlob(base64Data, mimeType);
        formData.append(`images[]`, blob);
      });
    }

    try {
      const token = await AsyncStorage.getItem("TOKEN");
      if (!token) {
        console.error("Token não encontrado no AsyncStorage");
        Alert.alert("Erro", "Token não encontrado.");
        return;
      }

      const response = await axios.post(`${api_url}/fields`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Dados da resposta:", response.data);
      Alert.alert("Campo criado com sucesso!");
      setModalOpen(false);
      await fetchFields();
    } catch (error) {
      console.error("Erro ao criar campo:", error);
      Alert.alert("Erro ao criar campo", error.message || "Erro desconhecido.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateField = async () => {
    if (!editingField || !editingField.id) {
      console.log("Erro: ID do campo não definido");
      return;
    }

    const formattedHourlyRate = (hourlyRate || "")
      .toString()
      .replace(/[^\d.-]/g, "");

    const updatedField = {
      ...editingField,
      name,
      location,
      type,
      hourly_rate: parseFloat(formattedHourlyRate),
      status,
    };

    const formData = new FormData();
    formData.append("_method", "PATCH");
    formData.append("name", updatedField.name);
    formData.append("location", updatedField.location);
    formData.append("type", updatedField.type);
    formData.append("hourly_rate", updatedField.hourly_rate);
    formData.append("status", updatedField.status);

    try {
      const token = await AsyncStorage.getItem("TOKEN");
      if (!token) {
        console.log("Erro: token não encontrado");
        return;
      }

      const response = await axios.post(
        `${api_url}/fields/${updatedField.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Resposta da API:", response.data);

      if (response.data.status === "success") {
        console.log("Campo atualizado com sucesso:", response.data.data);
        setModalOpen(false);
        await fetchFields();
      } else {
        console.log("Erro na atualização do campo:", response.data.message);
        Alert.alert(
          "Erro",
          response.data.message || "Não foi possível atualizar o campo."
        );
      }
    } catch (error) {
      console.log("Erro", error);
      Alert.alert("Erro", "Não foi possível atualizar o campo.");
    }
  };

  const handleUpdateImage = async (imageId, newImage) => {
    if (!editingField) return;

    const formData = new FormData();
    formData.append("_method", "PATCH");
    formData.append("images[]");
    formData.append("image_ids[]", imageId.toString());

    try {
      const token = await AsyncStorage.getItem("TOKEN");
      const response = await fetch(`${api_url}/fields/${editingField.id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Sucesso", "Imagem atualizada com sucesso.");
        // setEditingField((prev) => ({
        //   ...prev,
        //   images: data.images,
        // }));
      } else {
        Alert.alert("Erro", data.message || "Falha ao atualizar a imagem.");
      }
    } catch (error) {
      Alert.alert("Erro", "Falha ao atualizar a imagem.");
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (!editingField) return;

    const formData = new FormData();
    formData.append("_method", "PATCH");
    formData.append("image_ids[]", imageId);

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("TOKEN");
      const response = await fetch(`${api_url}/fields/${editingField.id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Sucesso", "Imagem excluída com sucesso.");

        // Atualize o estado das imagens e do campo em edição
        setImages((prevImages) =>
          prevImages.filter((image) => image.id !== imageId)
        );
        setEditingField((prev) => ({
          ...prev,
          images: prev.images.filter((image) => image.id !== imageId),
        }));
      } else {
        Alert.alert("Erro", data.message || "Falha ao excluir a imagem.");
      }
    } catch (error) {
      Alert.alert("Erro", "Falha ao excluir a imagem.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (imageId) => async (event) => {
    if (event.target.files && event.target.files[0]) {
      await handleUpdateImage(imageId, event.target.files[0]);
    }
  };

  const handleStoreImage = async (newImages) => {
    if (!editingField) return;

    const formData = new FormData();
    formData.append("_method", "PATCH");
    newImages.forEach((image) => {
      formData.append("images[]", {
        uri: image.uri,
        type: image.type || "image/jpeg",
        name: image.uri.split("/").pop(),
      });
    });

    try {
      const token = await AsyncStorage.getItem("TOKEN");
      const response = await fetch(`${api_url}/fields/${editingField.id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: formData,
      });
      const data = await response.json();

      if (response.ok) {
        Alert.alert("Sucesso", "Imagens atualizadas com sucesso.");
        setEditingField((prev) => ({
          ...prev,
          images: data.images,
        }));
      } else {
        Alert.alert("Erro", data.message || "Falha ao atualizar as imagens.");
      }
    } catch (error) {
      Alert.alert("Erro", "Falha ao atualizar as imagens.");
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
    console.log("Abrindo modal de edição com os dados do campo:", field);

    setName(field.name);
    setLocation(field.location);
    setType(field.type);
    setHourlyRate(field.hourly_rate.toString());
    setStatus(field.status || "inactive");
    setEditingField(field);

    setImages(
      field.images.map((image) => ({
        ...image,
        uri: `${api_url}/${image.path}`.replace("api/v1/", "public/"),
      })) || []
    );

    console.log("Editando campo:", {
      id: field.id,
      name: field.name,
      location: field.location,
      type: field.type,
      hourly_rate: field.hourly_rate.toString(),
      images: field.images.map((image) => ({
        ...image,
        uri: `${api_url}/${image.path}`.replace("api/v1/", "public/"),
      })),
    });

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

  const removeImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const translateStatus = (status) => {
    if (status === "active") {
      return "ATIVO";
    } else if (status === "inactive") {
      return "INATIVO";
    }
    return status;
  };

  const renderItem = ({ item }) => {
    // Verifica se há imagens na lista
    const hasImages = item.images && item.images.length > 0;

    return (
      <View style={styles.fieldItem}>
        {/* Exibe o Carousel ou uma mensagem se não houver imagens */}
        {hasImages ? (
          // <Carousel
          //   autoPlay
          //   autoPlayInterval={3000}
          //   data={item.images}
          //   renderItem={({ item: image }) => {
          //     const imageUrl = `${api_url}/${image.path}`.replace(
          //       "api/v1/",
          //       "public/"
          //     );
          //     return (
          //       <Pressable
          //         onPress={() => setSelectedImage(imageUrl)}
          //         style={styles.imageContainer}
          //       >
          //         <Image
          //           source={{ uri: imageUrl }}
          //           key={image.id}
          //           style={styles.carouselImage}
          //           onError={() => handleImageError(image.id)}
          //         />
          //       </Pressable>
          //     );
          //   }}
          //   width={width - 40}
          //   height={160}
          //   style={styles.imageContainer}
          //   loop
          // />
          <Text>TExte</Text>
        ) : (
          <Text style={styles.noImagesText}>
            Sem imagens da arena no momento
          </Text>
        )}
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
          <Text style={styles.fieldText}>
            <Text style={styles.fieldLabel}>Situação: </Text>
            <Text
              style={
                item.status === "active"
                  ? styles.statusActive
                  : styles.statusInactive
              }
            >
              {translateStatus(item.status)}
            </Text>
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
  };

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
            <Pressable
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
            </Pressable>
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
                onChangeText={(text, rawValue) => {
                  console.log("Valor bruto:", rawValue); // Verifica o valor bruto no console
                  setHourlyRate(rawValue); // Define o valor bruto
                }}
              />

              <View>
                <DisableButton status={status} setStatus={setStatus} />
              </View>

              {/* Imagens dentro do modal */}
              <Text style={styles.sectionTitle}>Imagens</Text>
              <View style={styles.imageList}>
                {images.map((image, index) => (
                  <View key={index} style={styles.imageWrapper}>
                    <Image
                      source={{ uri: image.uri }}
                      style={styles.image}
                      resizeMode="cover"
                    />
                    <Pressable
                      style={styles.removeImageButton}
                      // onPress={() => handleDeleteImage(image.id)}
                      onPress={() =>
                        editingField
                          ? handleDeleteImage(image.id)
                          : removeImage(index)
                      }
                    >
                      {loading ? (
                        <ActivityIndicator size="small" color="#fff" />
                      ) : (
                        <AntDesign name="close" size={20} color="#FFF" />
                      )}
                    </Pressable>
                  </View>
                ))}
                {images.length < 5 && (
                  <Pressable style={styles.uploadButton} onPress={pickImage}>
                    <AntDesign name="camerao" size={30} color="#007BFF" />
                  </Pressable>
                )}
              </View>
              <Pressable
                style={styles.saveButton}
                onPress={() => {
                  if (editingField) {
                    // Se estiver editando um campo, chama a função de edição
                    handleUpdateField(editingField);
                  } else {
                    // Se não estiver editando, chama a função de criação
                    handleCreateField();
                  }
                }}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={"#fff"} size={"small"} />
                ) : (
                  <Text style={styles.saveButtonText}>
                    {editingField ? "Salvar Alterações" : "Adicionar Campo"}
                  </Text>
                )}
              </Pressable>
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
    marginVertical: 16,
    textAlign: "center",
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
  statusActive: {
    color: "green",
    fontWeight: "bold",
  },
  statusInactive: {
    color: "red",
    fontWeight: "bold",
  },
  noImagesText: {
    textAlign: "center",
    fontWeight: "bold",
    marginVertical: 50,
  },
});

export default Campos;
