import React from "react";
import { StyleSheet, View } from "react-native";
import { Header as HeaderRNE } from "react-native-elements";
import PopUp from "../popupMenu/popUp";

const CustomHeader = () => {
  return (
    <View style={styles.containerHeader}>
      <HeaderRNE
        centerComponent={{
          text: "Relatório de usuários",
          style: styles.headerText,
        }}
        rightComponent={
          <View style={styles.headerRight}>
            <PopUp />
          </View>
        }
        containerStyle={styles.headerContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  containerHeader: {
    width: "100%",
    // backgroundColor: "#397af8",
    // alignItems: "center",
    // justifyContent: "center",
    paddingBottom: 10,
  },
  headerContainer: {
    borderBottomWidth: 0,
  },
  headerText: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "bold",
  },
  headerRight: {
    marginRight: 10,
  },
});

export default CustomHeader;
