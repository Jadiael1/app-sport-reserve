import React, { useState } from "react";
import { View, TextInput, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export const CustomPasswordInput = ({
  value,
  onChangeText,
  placeholder,
  onBlur,
}) => {
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        secureTextEntry={!isPasswordVisible}
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
      />
      <Pressable
        onPress={() => setPasswordVisible(!isPasswordVisible)}
        style={styles.iconContainer}
      >
        <Ionicons
          name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
          size={24}
          color="grey"
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",

    marginVertical: 10,
    width: "90%",
  },
  input: {
    flex: 1,
    height: 20,
    fontSize: 16,
  },
  iconContainer: {
    marginLeft: 10,
  },
});
