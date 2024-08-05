import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { Avatar, Button } from "react-native-elements";
import { FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Logout } from "../../../components/buttons/logout";
import { fetchUser } from "../../../api/api";
import { useNavigation } from "@react-navigation/native";

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    fetchUser(setUser);
  }, []);

  const reports = [
    {
      id: "1",
      title: "Relatório de Usuários",
      icon: "people",
      route: "RelatorioUsuarios",
    },
    {
      id: "2",
      title: "Relatório de Horários",
      icon: "time",
      route: "RelatorioHorarios",
    },
    {
      id: "3",
      title: "Relatório de Arenas",
      icon: "football",
      route: "RelatorioArenas",
    },
    {
      id: "4",
      title: "Relatório de Pagamentos",
      icon: "card",
      route: "RelatorioPagamentos",
    },
  ];

  const handleReportClick = (report) => {
    if (report.route) {
      navigation.navigate(report.route);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <View style={styles.headerContainer}>
          <Pressable>
            <Avatar
              size={32}
              rounded
              source={{ uri: "https://randomuser.me/api/portraits/men/35.jpg" }}
            />
          </Pressable>
          <View style={styles.userInfo}>
            {user ? (
              <Text style={styles.username}>{user.data.name}</Text>
            ) : (
              <Text style={styles.username}>Carregando...</Text>
            )}
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button title="Editar perfil" type="outline" />
        </View>
      </View>

      <Text style={styles.sectionTitle}>Relatórios</Text>
      <FlatList
        data={reports}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            style={styles.reportItem}
            onPress={() => handleReportClick(item)}
          >
            <Ionicons name={item.icon} size={26} color="black" />
            <Text style={styles.reportTitle}>{item.title}</Text>
          </Pressable>
        )}
      />
      <Logout />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 30,
  },
  profileContainer: {
    backgroundColor: "#f0f0f0",
    padding: 20,
    marginBottom: 20,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    backgroundColor: "#cdcdcd",
    marginRight: 20,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 20,
    fontWeight: "bold",
  },
  buttonContainer: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 20,
    marginTop: 20,
  },
  reportItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  reportTitle: {
    fontSize: 16,
    marginLeft: 10,
  },
});

export default AdminDashboard;
