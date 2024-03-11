import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { API_KEY, TOKEN } from "@env";
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen() {
  const [organizations, setOrganizations] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await axios.get(
          `https://api.trello.com/1/members/me/organizations?key=${API_KEY}&token=${TOKEN}`
        );
        setOrganizations(response.data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchOrganizations();
  }, []);

  return (
    <ScrollView style={styles.container}>
      {organizations.map((organization, index) => (
        <TouchableOpacity
          key={index}
          style={styles.card}
          onPress={() =>
            navigation.navigate("Boards", {
              organizationId: organization.id,
            })
          }
        >
          <Text style={styles.cardTitle}>
            {organization.displayName || "No Name"}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 20,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
