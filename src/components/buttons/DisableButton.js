import { View, Text, Switch, StyleSheet } from "react-native";

export const DisableButton = ({ status, setStatus }) => {
  const toggleSwitch = () =>
    setStatus(status === "active" ? "inactive" : "active");

  return (
    <View style={styles.container}>
      <Text>{status === "active" ? "Ativo" : "Inativo"}</Text>
      <Switch
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={status === "active" ? "#f5dd4b" : "#f4f3f4"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch}
        value={status === "active"}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 4
    // justifyContent: "center",
  },
  normalText: {
    fontSize: 18,
  },
  statusText: {
    fontWeight: "bold",
    fontSize: 16,
    marginRight: 10,
  },
});
