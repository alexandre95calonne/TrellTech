// OrganizationBoardsScreen.js
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

const OrganizationBoardsScreen = ({ route }) => {
  const { organizationId } = route.params;
  const [boards, setBoards] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await axios.get(
          `https://api.trello.com/1/organizations/${organizationId}/boards?key=${API_KEY}&token=${TOKEN}`
        );
        setBoards(response.data);
      } catch (error) {
        console.error("Error fetching boards:", error);
      }
    };

    fetchBoards();
  }, [organizationId]);

  return (
    <ScrollView style={styles.container}>
      {boards.map((board, index) => (
        <TouchableOpacity
          key={index}
          style={styles.card}
          onPress={() =>
            navigation.navigate("BoardLists", { boardId: board.id })
          }
        >
          <Text style={styles.cardTitle}>{board.name}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

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

export default OrganizationBoardsScreen;
