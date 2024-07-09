import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
} from "react-native";
import { Avatar, Button } from "react-native-elements";
import { FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Logout } from "../../../components/buttons/logout";

const AdminDashboard = () => {
  const reports = [
    { id: "1", title: "Relatório de Usuários", icon: "people" },
    { id: "2", title: "Relatório de Horários", icon: "time" },
    { id: "3", title: "Relatório de Pagamentos", icon: "card" },
    { id: "4", title: "Relatório de Cancelamentos", icon: "close-circle" },
  ];

  const handleProfileClick = () => {
    router.navigate("menuProfile");
  };

  const handleReportClick = (report) => {

    router.navigate(report.id);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Pressable onPress={handleProfileClick}>
          <Avatar
            rounded
            size="large"
            source={{ uri: "https://via.placeholder.com/150" }}
            containerStyle={styles.avatar}
          />
        </Pressable>
        <View style={styles.userInfo}>
          <Text style={styles.username}>Nome do admin</Text>
        </View>

        {/* <View style={styles.menuContainer}>
          <Pressable onPress={handleProfileClick}>
            <Ionicons name="menu" size={26} color="black" />
          </Pressable>
        </View> */}
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Editar perfil" type="outline" />
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerContainer: {
    flexDirection: "row",
    padding: 20,
    alignItems: "center",
    marginTop: 30,
  },
  avatar: {
    marginRight: 20,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 20,
    fontWeight: "bold",
  },
  bio: {
    fontSize: 14,
    color: "gray",
  },
  menuContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 14,
    color: "gray",
  },
  buttonContainer: {
    padding: 20,
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
  postImage: {
    width: "33%",
    height: 120,
    margin: 1,
  },
});

export default AdminDashboard;
