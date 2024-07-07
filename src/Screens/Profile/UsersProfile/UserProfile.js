import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Pressable,
} from "react-native";
import { Avatar, Button } from "react-native-elements";
import { FlatList } from "react-native";
// import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Logout } from "../../../components/buttons/logout";

const UserProfile = () => {
  const posts = [
    { id: "1", imageUrl: "https://via.placeholder.com/150" },
    { id: "2", imageUrl: "https://via.placeholder.com/150" },
    { id: "2", imageUrl: "https://via.placeholder.com/150" },
    { id: "2", imageUrl: "https://via.placeholder.com/150" },
    { id: "2", imageUrl: "https://via.placeholder.com/150" },
    { id: "2", imageUrl: "https://via.placeholder.com/150" },
    // Add more post URLs here
  ];

  const handleProfileClick = () => {
    router.navigate("menuProfile");
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Pressable>
          <Avatar
            rounded
            size="large"
            source={{ uri: "https://via.placeholder.com/150" }}
            containerStyle={styles.avatar}
          />
        </Pressable>
        <View style={styles.userInfo}>
          <Text style={styles.username}>Nome do usuário</Text>
          <Text style={styles.bio}>Jogador caro</Text>
        </View>

        <View>
          <Pressable onPress={handleProfileClick}>
            <Ionicons name="menu" size={26} color="black" />
          </Pressable>
          <Logout/>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>100</Text>
          <Text style={styles.statLabel}>Posts</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>200</Text>
          <Text style={styles.statLabel}>Horários Marcados</Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Editar perfil" type="outline" />
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        numColumns={3}
        renderItem={({ item }) => (
          <Image source={{ uri: item.imageUrl }} style={styles.postImage} />
        )}
      />
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
  postImage: {
    width: "33%",
    height: 120,
    margin: 1,
  },
});

export default UserProfile;
