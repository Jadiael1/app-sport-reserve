import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const CustomPasswordInput = ({ value, onChangeText, placeholder, onBlur }) => {
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
      <TouchableOpacity
        onPress={() => setPasswordVisible(!isPasswordVisible)}
        style={styles.iconContainer}
      >
        <Ionicons
          name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
          size={24}
          color="grey"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: '#fff',
    // borderRadius: 7,
    // padding: 10,
    marginVertical: 10,
    width: "90%",
    // elevation: 5,
  },
  input: {
    flex: 1,
    height: 20,
    fontSize: 16,
    // backgroundColor: 'red'
  },
  iconContainer: {
    marginLeft: 10,
  },
});

