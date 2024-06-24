import { View, Text, StyleSheet, Pressable } from "react-native";
import React from "react";

export default function home() {

  const logout = () =>{
    
    
  }

  return (
    <View style={styles.container}>
      <Text>home</Text>
      <Pressable>
        <Text onPress={logout}>Sair</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
