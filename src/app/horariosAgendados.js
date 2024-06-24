import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import api_url from "../constants/constants";
import useAuth from "../hooks/useAuth";

const ScheduledTimes = () => {
  const { isAuthenticated, loading } = useAuth();
  const [scheduledTimes, setScheduledTimes] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigation.navigate("login");
    }
  }, [isAuthenticated, loading, navigation]);

  useEffect(() => {
    const fetchScheduledTimes = async () => {
      try {
        const response = await axios.get(`${api_url}/auth/users`);
        setScheduledTimes(response.data);
      } catch (error) {
        console.error("Erro ao buscar horários agendados:", error);
      }
    };

    if (isAuthenticated) {
      fetchScheduledTimes();
    }
  }, [isAuthenticated]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Horários Agendados</Text>
      <FlatList
      // data={scheduledTimes}
      // renderItem={({ item }) => (
      //   <View style={styles.timeSlot}>
      //     <Text style={styles.timeText}>{item.time}</Text>
      //     <Text>{item.date}</Text>
      //   </View>
      // )}
      // keyExtractor={(item) => `${item.date}-${item.time}`}
      // contentContainerStyle={styles.timeList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8F4F8",
    alignItems: "center",
    paddingTop: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#3D5A80",
    marginBottom: 20,
  },
  timeList: {
    alignItems: "center",
  },
  timeSlot: {
    backgroundColor: "#fff",
    borderRadius: 7,
    padding: 15,
    marginVertical: 10,
    width: 300,
    alignItems: "center",
    elevation: 5,
  },
  timeText: {
    fontSize: 18,
    color: "#3D5A80",
    marginBottom: 10,
  },
});

export default ScheduledTimes;
