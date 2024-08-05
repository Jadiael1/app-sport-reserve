import React, { useEffect, useState } from "react";
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
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PopUp from "../components/popupMenu/popUp";
import CustomHeader from "../components/Headers/ReportsUser";

const RelatorioUsuarios = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

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
        params: { page }, // Passando a página como parâmetro
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      console.log("Resposta da API:", response.data);

      if (Array.isArray(response.data.data.data)) {
        const newUsers = response.data.data.data;
        setUsers((prevUsers) => [...prevUsers, ...newUsers]);
        setFilteredUsers((prevUsers) => [...prevUsers, ...newUsers]);

        if (newUsers.length < response.data.data.per_page) {
          setHasMore(false); // Desabilitar a paginação se não houver mais dados
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
    Alert.alert("Editar Usuário", `Editar usuário ${user.name}`);
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
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  areaView: {
    // paddingTop: 30,
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  headerContainer: {
    // backgroundColor: "#3D6DCC",
    // justifyContent: "space-around",
    borderBottomWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    // backgroundColor: "red",
  },
  headerText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    backgroundColor: "blue",
  },
  container: {
    padding: 16,
  },
  contentSearch: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchInput: {
    width: "80%",
    marginHorizontal: "auto",
    marginVertical: 16,
  },
  btnAdc: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  card: {
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
  },

  descriptionUser: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
    borderTopWidth: 1,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 8,
  },
  userDetail: {
    fontSize: 16,
    color: "#555",
  },
  label: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  actions: {
    marginVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 4,
  },
  editButton: {
    backgroundColor: "#007bff",
  },
  deleteButton: {
    backgroundColor: "#dc3545",
  },
  statusActive: {
    color: "green",
    fontWeight: "bold",
  },
  statusInactive: {
    color: "#dc3545",
    fontWeight: "bold",
  },
  headerRight: {
    display: "flex",
    flexDirection: "row",
    marginTop: 5,
  },
  containerHeader: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#397af8",
    marginBottom: 20,
    width: "100%",
    paddingVertical: 15,
  },
});

export default RelatorioUsuarios;
