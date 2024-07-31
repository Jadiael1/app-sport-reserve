import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Alert,
  Pressable,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";

const RelatorioUsuarios = () => {
  const [users, setUsers] = useState([]);

  // useEffect(() => {
  //   // Simulação de busca de dados (você substituirá isso pela chamada real à API)
  //   fetchUsers();
  // }, []);

  // const fetchUsers = async () => {
  //   try {
  //     const response = await fetch("https://api.example.com/users");
  //     const data = await response.json();
  //     setUsers(data);
  //   } catch (error) {
  //     console.error(error);
  //     Alert.alert("Erro", "Não foi possível carregar os usuários.");
  //   }
  // };

  const handleEdit = (user) => {
    Alert.alert("Editar Usuário", `Editar usuário ${user.name}`);
    // Aqui você pode navegar para uma tela de edição, se necessário
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
      const response = await fetch(`https://api.example.com/users/${user.id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setUsers((prevUsers) => prevUsers.filter((u) => u.id !== user.id));
        Alert.alert("Sucesso", "Usuário excluído com sucesso.");
      } else {
        Alert.alert("Erro", "Não foi possível excluir o usuário.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível excluir o usuário.");
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.userCard}>
      <Text style={styles.userName}>{item.name}</Text>
      <Text style={styles.userEmail}>{item.email}</Text>
      <View style={styles.actions}>
        <Pressable onPress={() => handleEdit(item)}>
          <FontAwesome name="edit" size={24} color="blue" />
        </Pressable>
        <Pressable onPress={() => handleDelete(item)}>
          <FontAwesome name="trash" size={24} color="red" />
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Relatório de Usuários</Text>
      <FlatList
        data={users}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  userCard: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  userEmail: {
    fontSize: 16,
    color: "#555",
    marginBottom: 8,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default RelatorioUsuarios;
