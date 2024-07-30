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
  const [loading, setLoading] = useState(false);

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
  const filteredFields = fields.filter(
    (field) =>
      field.name && field.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  //  const handleSaveField = async () => {
  //   if (!name || !location || !type || !hourlyRate) {
  //     Alert.alert("Erro", "Todos os campos são obrigatórios.");
  //     return;
  //   }

  //   try {
  //     const validImages = images.filter((image) => {
  //       const allowedTypes = ["image/jpeg", "image/png"];
  //       return allowedTypes.includes(image.type);
  //     });

  //     if (validImages.length !== images.length) {
  //       Alert.alert(
  //         "Erro",
  //         "Todos os arquivos devem ser imagens com tipo: jpg, jpeg, png."
  //       );
  //       return;
  //     }

  //     const hourlyRateNumber = parseFloat(
  //       hourlyRate.replace(",", ".").replace("R$", "").trim()
  //     );

  //     const token = await AsyncStorage.getItem("TOKEN");
  //     if (!token) {
  //       Alert.alert("Erro", "Token de autenticação não encontrado.");
  //       return;
  //     }

  //     const formData = new FormData();
  //     formData.append("name", name);
  //     formData.append("location", location);
  //     formData.append("type", type);
  //     formData.append("hourly_rate", hourlyRateNumber.toString());

  //     validImages.forEach((image, index) => {
  //       formData.append(`images[${index}]`, {
  //         uri: image.uri,
  //         type: image.type,
  //         name: `image${index}.${image.type.split("/")[1]}`,
  //       });
  //     });

  //     const url = editingField
  //       ? `${api_url}/fields/${editingField.id}`
  //       : `${api_url}/fields`;
  //     const method = editingField ? "PATCH" : "POST";

  //     const response = await fetch(url, {
  //       method,
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         "Content-Type": "multipart/form-data",
  //       },
  //       body: formData,
  //     });

  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       Alert.alert(
  //         "Erro",
  //         errorData.message || "Não foi possível salvar o campo."
  //       );
  //       return;
  //     }

  //     const data = await response.json();

  //     Alert.alert(
  //       "Sucesso",
  //       `Campo ${editingField ? "atualizado" : "adicionado"} com sucesso.`
  //     );
  //     setFields(
  //       editingField
  //         ? fields.map((field) => (field.id === editingField.id ? data : field))
  //         : [...fields, data]
  //     );
  //     setName("");
  //     setLocation("");
  //     setType("");
  //     setHourlyRate("");
  //     setImages([]);
  //     setModalOpen(false);
  //     setEditingField(null);
  //   } catch (error) {
  //     console.error("Erro ao salvar campo:", error);
  //     Alert.alert("Erro", "Não foi possível salvar o campo.");
  //   }
  // };

  const handleCreateField = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("location", location);
    formData.append("type", type);
    formData.append(
      "hourly_rate",
      parseFloat(hourlyRate.replace(/[^\d.-]/g, ""))
    );

    // Adiciona imagens ao FormData
    if (images) {
      Array.from(images).forEach((image) => {
        console.log("images", image);
        formData.append("images[]", image);
      });
    }

    try {
      const token = await AsyncStorage.getItem("TOKEN");
      if (!token) {
        console.error("Token não encontrado no AsyncStorage");
        Alert.alert("Erro", "Token não encontrado.");
        return;
      }

      console.log("Token recuperado:", token); // Log para verificar o token

      console.log("Enviando requisição para:", `${api_url}/fields`); // Log para verificar a URL

      const response = await fetch(`${api_url}/fields`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          // "Content-Type": "multipart/form-data", // Não defina Content-Type aqui; o navegador irá definir automaticamente
        },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        console.error("Erro ao criar campo:", data);
        Alert.alert(
          "Erro ao criar campo",
          data.message || "Erro desconhecido."
        );
        return;
      }

      console.log("Dados da resposta:", data);
      Alert.alert("Campo criado com sucesso!");

      // Atualiza as imagens se houver
      if (images && images.length > 0) {
        await handleStoreImage(images);
      }

      setModalOpen(false);
    } catch (error) {
      console.error("Erro ao criar campo:", error);
      Alert.alert("Erro ao criar campo", error.message || "Erro desconhecido.");
    }
  };

  const handleUpdateField = async (field) => {
    if (!field || !field.id) {
      console.log("Erro: ID do campo não definido");
      return;
    }

    const hourlyRateNumber = parseFloat(
      field.hourly_rate.replace(",", ".").replace("R$", "").trim()
    );

    const status =
      field.status === "active" || field.status === "inactive"
        ? field.status
        : "inactive";

    const formData = new FormData();
    formData.append("_method", "PATCH");
    formData.append("name", field.name);
    formData.append("location", field.location);
    formData.append("type", field.type);
    formData.append("hourly_rate", hourlyRateNumber.toString());
    formData.append("status", status);

    if (field.images && field.images.length > 0) {
      field.images.forEach((image, index) => {
        formData.append(`images[${index}]`, {
          uri: image.uri,
          type: image.type || "image/jpeg",
          name: `image${index}.jpg`,
        });
      });
    }

    try {
      const token = await AsyncStorage.getItem("TOKEN");
      if (!token) {
        console.log("Erro: token não encontrado");
        return;
      }

      const response = await fetch(`${api_url}/fields/${field.id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Sucesso", "Arena atualizada com sucesso!");
        setFields((prevFields) =>
          prevFields.map((f) => (f.id === field.id ? data : f))
        );
      } else {
        Alert.alert(
          "Erro",
          data.message || "Não foi possível atualizar o campo."
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
    formData.append("images[]", {
      uri: newImage.uri,
      type: newImage.type,
      name: newImage.uri.split("/").pop(),
    });
    formData.append("image_ids[]", imageId.toString());

    try {
      const token = await AsyncStorage.getItem("TOKEN");
      const response = await fetch(`${api_url}/fields/${editingField.id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Sucesso", "Imagem atualizada com sucesso.");
        setEditingField((prev) => ({
          ...prev,
          images: data.images,
        }));
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
        type: image.type || "image/jpeg", // Verifica se o tipo está presente
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
    console.log("Abrindo modal de edição com os dados do campo:");
    console.log(field);

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

    // Adicione console.log para verificar os dados
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
      const newImage = result.assets[0];
      setImages((prevImages) => [...prevImages, newImage]);
      handleStoreImage([newImage]);
    }
  };

  const removeImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const translateStatus = (status) => {
    if (status === "active") {
      return "ATIVO";
    } else if (status === "inactive") {
      return "inativo";
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
          <Text>TEste</Text>
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
        keyExtractor={(item) => item.id}
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
                    <Pressable
                      style={styles.removeImageButton}
                      // onPress={() => handleDeleteImage(image.id)}
                      onPress={() =>
                        editingField
                          ? handleDeleteImage(image.id)
                          : removeImage(image.index)
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
