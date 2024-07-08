import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "react-native-elements";

const MenuProfile = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.menuText}>Menu</Text>
      <Button title="Option 1" type="outline" onPress={() => {}} />
      <Button title="Option 2" type="outline" onPress={() => {}} />
      <Button
        title="Close Menu"
        type="outline"
        onPress={() => navigation.goBack()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  menuText: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default MenuProfile;
