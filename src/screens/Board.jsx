import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import axios from "axios";
import { API_KEY, TOKEN } from "@env";

const windowWidth = Dimensions.get("window").width;

const BoardListsScreen = ({ route }) => {
  const { boardId } = route.params;
  const [lists, setLists] = useState([]);

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const response = await axios.get(
          `https://api.trello.com/1/boards/${boardId}/lists?key=${API_KEY}&token=${TOKEN}`
        );
        setLists(response.data);
      } catch (error) {
        console.error("Error fetching lists:", error);
      }
    };

    fetchLists();
  }, [boardId]);

  return (
    <ScrollView
      horizontal={true}
      style={styles.container}
      showsHorizontalScrollIndicator={false}
    >
      {lists.map((list, index) => (
        <View key={index} style={styles.listCard}>
          <Text style={styles.listTitle}>{list.name}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  listCard: {
    width: windowWidth * 0.75,
    backgroundColor: "#fff",
    margin: 10,
    borderRadius: 8,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default BoardListsScreen;
