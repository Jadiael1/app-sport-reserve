import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSession } from "../../context/UserContext";

export const Logout = () => {
  const [loadingLogout, setLoadingLogout] = useState(false);
  const { signOut } = useSession();
  const navigation = useNavigation();

  const handleLogout = async () => {
    setLoadingLogout(true);
    try {
      await signOut();
      navigation.navigate("index");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    } finally {
      setLoadingLogout(false);
    }
  };

  return (
    <View>
      <Pressable style={styles.containerLogout} onPress={handleLogout}>
        <MaterialIcons name="logout" size={24} color="black" />
        {loadingLogout ? (
          <ActivityIndicator size={"small"} color={"#007BFF"} />
        ) : (
          <>
            <Text style={styles.textSair}>Sair</Text>
          </>
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  containerLogout: {
    flexDirection: "row",
    marginLeft: 20,
    marginTop: 20,
  },
  textSair: {
    fontSize: 16,
    marginLeft: 10,
  },
});
