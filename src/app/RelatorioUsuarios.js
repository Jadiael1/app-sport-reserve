import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Alert,
  Text,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Input, Card, Button, Header } from "react-native-elements";
import { api_url } from "../constants/constants";
import { format } from "date-fns";
import { FontAwesome } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomHeader from "../components/Headers/ReportsUser";
import ModalsAdUser from "../components/Modals/ModalsAdUser";

const RelatorioUsuarios = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [modalMode, setModalMode] = useState("add"); // "edit" or "add"

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  useEffect(() => {
    if (search) {
      setFilteredUsers(
        users.filter((user) =>
          user.name.toLowerCase().includes(search.toLowerCase())
        )
      );
    } else {
      setFilteredUsers(users);
    }
  }, [search, users]);

  const fetchUsers = async (page) => {
    if (loading) return;
    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("TOKEN");
      const response = await axios.get(`${api_url}/users`, {
        params: { page },
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (Array.isArray(response.data.data.data)) {
        const newUsers = response.data.data.data;
        setUsers((prevUsers) => [...prevUsers, ...newUsers]);
        setFilteredUsers((prevUsers) => [...prevUsers, ...newUsers]);

        if (newUsers.length < response.data.data.per_page) {
          setHasMore(false);
        }
      } else {
        throw new Error("Dados dos usuários não estão no formato esperado.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível carregar os usuários.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setUserToEdit(user);
    setModalMode("edit");
    setIsModalVisible(true);
  };

  const handleDelete = (user) => {
    Alert.alert(
      "Confirmar Exclusão",
      `Tem certeza de que deseja excluir ${user.name}?`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", onPress: () => deleteUser(user) },
      ]
    );
  };

  const deleteUser = async (user) => {
    try {
      const token = await AsyncStorage.getItem("TOKEN");
      const response = await fetch(`${api_url}/users/${user.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (response.ok) {
        setUsers((prevUsers) => prevUsers.filter((u) => u.id !== user.id));
        setFilteredUsers((prevUsers) =>
          prevUsers.filter((u) => u.id !== user.id)
        );
        Alert.alert("Sucesso", "Usuário excluído com sucesso.");
      } else {
        Alert.alert("Erro", "Não foi possível excluir o usuário.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível excluir o usuário.");
    }
  };

  const formatCPF = (cpf) => {
    return cpf
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), "dd/MM/yyyy HH:mm:ss");
  };

  const getStatusText = (active) => (active === 1 ? "Ativo" : "Inativo");

  const keyExtractor = (item, index) => `${item.id}-${index}`;

  const renderItem = ({ item }) => (
    <Card containerStyle={styles.card}>
      <Card.Title>
        <Text>
          <FontAwesome6
            name="user"
            size={24}
            color="black"
            style={{ marginRight: 10 }}
          />
          {item.name}
        </Text>
      </Card.Title>
      <Card.Divider />

      <View style={styles.descriptionUser}>
        <FontAwesome name="drivers-license-o" size={24} color="black" />
        <View style={styles.infoContainer}>
          <Text style={styles.label}>CPF</Text>
          <Text style={styles.userDetail}>{formatCPF(item.cpf)}</Text>
        </View>
      </View>

      <View style={styles.descriptionUser}>
        <MaterialCommunityIcons name="email" size={24} color="black" />
        <View style={styles.infoContainer}>
          <Text style={styles.label}>E-mail</Text>
          <Text style={styles.userDetail}>{item.email}</Text>
        </View>
      </View>

      <View style={styles.descriptionUser}>
        <FontAwesome6 name="user-check" size={24} color="black" />
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Data de Verificação</Text>
          <Text style={styles.userDetail}>
            {formatDate(item.email_verified_at)}
          </Text>
        </View>
      </View>

      <View style={styles.descriptionUser}>
        <MaterialCommunityIcons name="list-status" size={24} color="black" />
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Situação</Text>
          <Text
            style={
              item.active === 1 ? styles.statusActive : styles.statusInactive
            }
          >
            {getStatusText(item.active)}
          </Text>
        </View>
      </View>

      <View style={styles.descriptionUser}>
        <MaterialIcons name="admin-panel-settings" size={24} color="black" />
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Tipo de usuário</Text>
          <Text style={item.is_admin ? styles.styleAdmin : styles.user}>
            {item.is_admin ? "Administrador" : "Usuário"}
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <Pressable
          style={[styles.actionButton, styles.editButton]}
          onPress={() => handleEdit(item)}
        >
          <FontAwesome name="edit" size={20} color="white" />
        </Pressable>
        <Pressable
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDelete(item)}
        >
          <FontAwesome name="trash" size={20} color="white" />
        </Pressable>
      </View>
    </Card>
  );

  const loadMoreData = () => {
    if (!loading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <SafeAreaView style={styles.areaView}>
      <CustomHeader />

      <View style={styles.container}>
        <View style={styles.contentSearch}>
          <Input
            placeholder="Buscar usuário"
            value={search}
            onChangeText={setSearch}
            containerStyle={styles.searchInput}
            leftIcon={{ type: "font-awesome", name: "search" }}
          />
        </View>

        <FlatList
          data={filteredUsers}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          onEndReached={loadMoreData}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loading ? <ActivityIndicator size="large" color="#0000ff" /> : null
          }
        />

        {/* Modal para adicionar/editar usuário */}
        <ModalsAdUser
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          userToEdit={userToEdit}
          mode={modalMode}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  contentSearch: {
    marginBottom: 10,
  },
  searchInput: {
    backgroundColor: "#fff",
    borderRadius: 5,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  card: {
    borderRadius: 10,
    borderWidth: 0,
    marginBottom: 10,
  },
  descriptionUser: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  infoContainer: {
    marginLeft: 10,
  },
  label: {
    fontWeight: "bold",
  },
  userDetail: {
    fontSize: 16,
  },
  statusActive: {
    color: "green",
  },
  statusInactive: {
    color: "red",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  actionButton: {
    padding: 10,
    borderRadius: 5,
    marginLeft: 5,
  },
  editButton: {
    backgroundColor: "#007bff",
  },
  deleteButton: {
    backgroundColor: "#dc3545",
  },
  areaView: {
    flex: 1,
  },
  styleAdmin: {
    fontWeight: "bold",
    color: "green",
  },
  user: {
    fontWeight: "normal",
    color: "black",
  },
});

export default RelatorioUsuarios;
