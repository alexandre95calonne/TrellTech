import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Button,
} from "react-native";
import axios from "axios";
import { API_KEY, TOKEN } from "@env";
import { RectButton, Swipeable } from "react-native-gesture-handler";

const windowWidth = Dimensions.get("window").width;

const BoardListsScreen = ({ route }) => {
  const { boardId } = route.params;
  const [lists, setLists] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalForCreatingList, setIsModalForCreatingList] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [cardDetails, setCardDetails] = useState(null);
  const [newListName, setNewListName] = useState("");
  //[FEAT]: delete list
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [listToDelete, setListToDelete] = useState(null);


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

  const createList = async () => {
    if (newListName.trim()) {
      try {
        const response = await axios.post(
          `https://api.trello.com/1/lists?name=${encodeURIComponent(
            newListName
          )}&idBoard=${boardId}&key=${API_KEY}&token=${TOKEN}`
        );
        if (response.data) {
          setLists([...lists, response.data]);
          setIsModalForCreatingList(false);
        }
      } catch (error) {
        console.error("Error creating list: ", error);
      }
    } else {
      alert("Please enter a list name.");
    }
  };

  const deleteList = async () => {
    try {
      await axios.delete(`https://api.trello.com/1/lists/${listToDelete}?key=${API_KEY}&token=${TOKEN}`);
      setLists(lists.filter(list => list.id !== listToDelete));
      setListToDelete(null);
      setIsDeleteModalVisible(false);
    } catch (error) {
      console.error("Error deleting list: ", error);
    }
  };
  


  useEffect(() => {
    fetchListsAndCards();
  }, [boardId]);

  return (
    <ScrollView style={styles.container}>

    
      <TouchableOpacity
        style={styles.button}
        onPress={() => setIsModalForCreatingList(true)}
      >
        <Text style={styles.buttonText}>Create A list</Text>
      </TouchableOpacity> 
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalForCreatingList}
        onRequestClose={() => setIsModalForCreatingList(false)}
      >
        <View style={styles.modalView}>
          <TextInput
            style={styles.input}
            placeholder="New List Name"
            value={newListName}
            onChangeText={setNewListName}
          />
          <Button title="Create A List" onPress={createList} />
          <Button title="Cancel" onPress={() => setIsModalForCreatingList(false)} />
        </View>
      </Modal>
  

    <ScrollView
      horizontal={true}
      style={styles.container}
      showsHorizontalScrollIndicator={false}
    >
      {lists.map((list, index) => (
        <View key={index} style={styles.listCard}>
          <Text style={styles.listTitle}>{list.name}</Text>
          <Button title="Delete List" onPress={() => { setListToDelete(list.id); setIsDeleteModalVisible(true); }} />
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

      <Modal
      animationType="slide"
      transparent={true}
      visible={isDeleteModalVisible}
      onRequestClose={() => setIsDeleteModalVisible(false)}
      >
      <View style={styles.modalView}>
        <Text>Are you sure you want to delete this list?</Text>
        <Button title="Yes, delete it" onPress={deleteList} />
        <Button title="No, cancel" onPress={() => setIsDeleteModalVisible(false)} />
      </View>
     </Modal>
      
    </ScrollView>
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
  modalBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },

  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  modalView: {
    marginTop: 150,
    marginHorizontal: 50,
    backgroundColor: "white",
    borderRadius: 5,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    width: "100%",
    padding: 10,
  },
  

});

export default BoardListsScreen;