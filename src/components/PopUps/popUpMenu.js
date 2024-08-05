import React, { useRef, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Animated,
  Easing,
} from "react-native";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import ModalsAdUser from "../Modals/ModalsAdUser";

const PopUp = () => {
  const [visible, setVisible] = useState(false);
  const [adUserVisible, setAdUserVisible] = useState(false);
  const scale = useRef(new Animated.Value(0)).current;

  const options = [
    {
      title: "Adicionar usuário",
      icon: "adduser",
      action: () => {
        setAdUserVisible(true);
        resizeBox(0);
      },
    },
    {
      title: "Gerar PDF",
      icon: "pdffile1",
      action: () => {
        alert("Gerar PDF");
        resizeBox(0);
      },
    },
  ];

  function resizeBox(to) {
    to === 1 && setVisible(true);
    Animated.timing(scale, {
      toValue: to,
      useNativeDriver: true,
      duration: 200,
      easing: Easing.linear,
    }).start(() => to === 0 && setVisible(false));
  }

  return (
    <>
      <Pressable onPress={() => resizeBox(1)}>
        <Ionicons name="options" size={24} color="#fff" />
      </Pressable>

      <Modal transparent visible={visible}>
        <SafeAreaView style={styles.overlay} onTouchStart={() => resizeBox(0)}>
          <Animated.View style={styles.popUp}>
            {options.map((option, index) => (
              <Pressable
                key={index}
                onPress={option.action}
                style={[
                  styles.option,
                  { borderBottomWidth: index === options.length - 1 ? 0 : 1 },
                ]}
              >
                <Text>{option.title}</Text>
                <AntDesign
                  name={option.icon}
                  size={26}
                  color={"#212121"}
                  style={{ marginLeft: 10 }}
                />
              </Pressable>
            ))}
          </Animated.View>
        </SafeAreaView>
      </Modal>

      <ModalsAdUser
        visible={adUserVisible}
        onClose={() => setAdUserVisible(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  popUp: {
    borderRadius: 8,
    borderColor: "#333",
    borderWidth: 1,
    backgroundColor: "#fff",
    padding: 10,
    position: "absolute",
    top: 80,
    right: 10,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 7,
    paddingVertical: 10,
    borderBottomColor: "#ccc",
  },
});

export default PopUp;
