import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { API_KEY, TOKEN } from "@env";

const windowWidth = Dimensions.get("window").width;

const BoardListsScreen = ({ route }) => {
  const { boardId } = route.params;
  const [lists, setLists] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [cardDetails, setCardDetails] = useState(null);

  const fetchCardDetails = async (cardId) => {
    try {
      const response = await axios.get(
        `https://api.trello.com/1/cards/${cardId}?key=${API_KEY}&token=${TOKEN}`
      );
      setCardDetails(response.data);
      setIsModalVisible(true);
    } catch (error) {
      console.error("Error fetching card details:", error);
    }
  };

  const fetchListsAndCards = async () => {
    try {
      const listsResponse = await axios.get(
        `https://api.trello.com/1/boards/${boardId}/lists?key=${API_KEY}&token=${TOKEN}`
      );
      const listsWithData = listsResponse.data;

      for (let list of listsWithData) {
        const cardsResponse = await axios.get(
          `https://api.trello.com/1/lists/${list.id}/cards?key=${API_KEY}&token=${TOKEN}`
        );
        list.cards = cardsResponse.data;
      }
      setLists(listsWithData);
    } catch (error) {
      console.error("Error fetching lists and cards:", error);
    }
  };

  useEffect(() => {
    fetchListsAndCards();
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
          <ScrollView style={styles.cardsContainer}>
            {list.cards?.map((card, cardIndex) => (
              <TouchableOpacity
                key={cardIndex}
                style={styles.card}
                onPress={() => fetchCardDetails(card.id)}
              >
                <Text style={styles.cardTitle}>{card.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      ))}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          setIsModalVisible(!isModalVisible);
        }}
      >
        <View
          style={styles.modalBackdrop}
          onTouchStart={() => setIsModalVisible(false)}
        >
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>{cardDetails?.name}</Text>
            <Text>{cardDetails?.desc}</Text>
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => setIsModalVisible(!isModalVisible)}
            >
              <Text style={styles.textStyle}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  cardsContainer: {
    maxHeight: 200,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 6,
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  label: {
    fontSize: 12,
    fontWeight: "500",
    color: "#FFFFFF",
    backgroundColor: "#0079BF",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: "hidden",
    alignSelf: "flex-start",
    marginBottom: 4,
  },
  bottomSection: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 12,
    color: "#555",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -(windowWidth * 0.4) }, { translateY: -120 }],
    width: windowWidth * 0.8,
  },
  modalBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default BoardListsScreen;
