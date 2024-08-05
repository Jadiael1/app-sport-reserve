import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import { Entypo, AntDesign } from "@expo/vector-icons";

const PopUp = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [dropdownHeight] = useState(new Animated.Value(0));

  const toggleDropdown = () => {
    Animated.timing(dropdownHeight, {
      toValue: dropdownVisible ? 0 : 150,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start(() => {
      setDropdownVisible(!dropdownVisible);
    });
  };

  const handleGeneratePDF = () => {
    console.log("Gerar PDF");
    toggleDropdown();
  };

  const handleInsertUser = () => {
    console.log("Inserir Usuário");
    toggleDropdown();
  };

  const handleSearchUser = () => {
    console.log("Buscar Usuário");
    toggleDropdown();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleDropdown} style={styles.menuButton}>
        <Entypo name="dots-three-vertical" size={24} color="white" />
      </TouchableOpacity>
      {dropdownVisible && (
        <Animated.View style={[styles.dropdown, { height: dropdownHeight }]}>
          <TouchableOpacity
            onPress={handleGeneratePDF}
            style={styles.dropdownItem}
          >
            <AntDesign
              name="pdffile1"
              size={24}
              color="#000"
              style={styles.buttonIcon}
            />
            <Text style={styles.buttonText}>Gerar PDF</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleInsertUser}
            style={styles.dropdownItem}
          >
            <Entypo
              name="add-user"
              size={24}
              color="#000"
              style={styles.buttonIcon}
            />
            <Text style={styles.buttonText}>Inserir Usuário</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSearchUser}
            style={styles.dropdownItem}
          >
            <Entypo
              name="magnifying-glass"
              size={24}
              color="#000"
              style={styles.buttonIcon}
            />
            <Text style={styles.buttonText}>Buscar Usuário</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-end",
    position: "relative",
    zIndex: 1000,
  },
  menuButton: {
    borderRadius: 50,
    zIndex: 10001,
  },
  dropdown: {
    width: 200,
    backgroundColor: "#fff",
    borderRadius: 8,
    position: "absolute",
    top: 30,
    right: 10,
    elevation: 5,
    zIndex: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    overflow: "hidden",
  },
  dropdownItem: {
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    fontSize: 16,
    color: "#333",
  },
});

export default PopUp;
