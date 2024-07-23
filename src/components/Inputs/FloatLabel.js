import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

export const FloatLabelInput = ({ label, value, onChangeText, placeholder, style }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.label,
          { top: isFocused || value ? 0 : 14, fontSize: isFocused || value ? 12 : 16 }
        ]}
      >
        {label}
      </Text>
      <TextInput
        style={[styles.input, style]}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={isFocused ? "" : placeholder}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    position: "relative",
  },
  label: {
    position: "absolute",
    left: 10,
    color: "#666",
    backgroundColor: "#fff",
    paddingHorizontal: 4,
    transition: "all 0.2s",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    padding: 10,
    height: 50,
  },
});


