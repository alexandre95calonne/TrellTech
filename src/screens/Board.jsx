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
import { Picker } from "@react-native-picker/picker";

const windowWidth = Dimensions.get("window").width;

const BoardListsScreen = ({ route }) => {
  const { boardId } = route.params;
  const [orgId, setOrgId] = useState(null);
  const [lists, setLists] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalForCreatingList, setIsModalForCreatingList] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [cardDetails, setCardDetails] = useState(null);
  const [newListName, setNewListName] = useState("");
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [listToDelete, setListToDelete] = useState(null);
  const [isModalForCreatingCardVisible, setIsModalForCreatingCardVisible] =
    useState(false);
  const [newCardName, setNewCardName] = useState("");
  const [listForNewCard, setListForNewCard] = useState(null);
  const [cardToDelete, setCardToDelete] = useState(null);
  const [editableCardDetails, setEditableCardDetails] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [members, setMembers] = useState([]);
  const [selectedMemberId, setSelectedMemberId] = useState(null);

  console.log(members);

  const fetchBoardDetails = async () => {
    try {
      const boardResponse = await axios.get(
        `https://api.trello.com/1/boards/${boardId}?key=${API_KEY}&token=${TOKEN}&fields=name,idOrganization`
      );
      const orgId = boardResponse.data.idOrganization;

      setOrgId(orgId);
    } catch (error) {
      console.error("Error fetching board details:", error);
    }
  };

  const fetchOrgMembers = async () => {
    if (!orgId) {
      console.log("Organization ID is not set.");
      return;
    }

    try {
      const membersResponse = await axios.get(
        `https://api.trello.com/1/organizations/${orgId}/members?key=${API_KEY}&token=${TOKEN}`
      );
      setMembers(membersResponse.data);
    } catch (error) {
      console.error("Error fetching organization members:", error);
    }
  };

  const fetchCardDetails = async (cardId) => {
    try {
      const response = await axios.get(
        `https://api.trello.com/1/cards/${cardId}?key=${API_KEY}&token=${TOKEN}`
      );
      setCardDetails(response.data);
      setEditableCardDetails(response.data);
      setHasChanges(false);
      setIsModalVisible(true);
    } catch (error) {
      console.error("Error fetching card details:", error);
    }
  };

  const saveCardDetails = async () => {
    try {
      const response = await axios.put(
        `https://api.trello.com/1/cards/${editableCardDetails.id}?key=${API_KEY}&token=${TOKEN}`,
        {
          name: editableCardDetails.name,
        }
      );
      setCardDetails(response.data);
      setHasChanges(false);
      await fetchListsAndCards();
    } catch (error) {
      console.error("Error saving card details: ", error);
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

  const confirmDeleteList = async (listId) => {
    try {
      const response = await axios.delete(
        `https://api.trello.com/1/lists/${listId}?key=${API_KEY}&token=${TOKEN}`
      );
      if (response.status === 200 || response.status === 204) {
        setLists(lists.filter((list) => list.id !== listId));
        setIsDeleteModalVisible(false);
      }
    } catch (error) {
      console.error("Error deleting list: ", error);
    }
  };

  const createCard = async () => {
    if (newCardName.trim() && listForNewCard) {
      try {
        const response = await axios.post(
          `https://api.trello.com/1/cards?name=${encodeURIComponent(
            newCardName
          )}&idList=${listForNewCard}&key=${API_KEY}&token=${TOKEN}`
        );
        if (response.data) {
          const updatedLists = lists.map((list) => {
            if (list.id === listForNewCard) {
              list.cards = [...list.cards, response.data];
            }
            return list;
          });
          setLists(updatedLists);
          setIsModalForCreatingCardVisible(false);
        }
      } catch (error) {
        console.error("Error creating card: ", error);
      }
    } else {
      alert("Please enter a card name and select a list.");
    }
  };

  const deleteCard = async () => {
    if (cardToDelete) {
      try {
        const response = await axios.delete(
          `https://api.trello.com/1/cards/${cardToDelete}?key=${API_KEY}&token=${TOKEN}`
        );
        if (response.status === 200 || response.status === 204) {
          const updatedLists = lists.map((list) => {
            list.cards = list.cards.filter((card) => card.id !== cardToDelete);
            return list;
          });
          setLists(updatedLists);
          setCardToDelete(null);
        }
      } catch (error) {
        console.error("Error deleting card: ", error);
      }
    }
  };

  useEffect(() => {
    fetchListsAndCards();
    fetchBoardDetails();
  }, [boardId]);

  useEffect(() => {
    if (orgId) {
      fetchOrgMembers();
    }
  }, [orgId]);

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
          <Button
            title="Cancel"
            onPress={() => setIsModalForCreatingList(false)}
          />
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
            <Button
              title="Delete List"
              onPress={() => {
                setListToDelete(list.id);
                setIsDeleteModalVisible(true);
              }}
            />
            <Button
              title="Create Card"
              onPress={() => {
                setListForNewCard(list.id);
                setIsModalForCreatingCardVisible(true);
              }}
            />

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
          <View style={styles.modalView}>
            <TextInput
              style={styles.input}
              value={editableCardDetails?.name}
              onChangeText={(text) => {
                setEditableCardDetails({ ...editableCardDetails, name: text });
                setHasChanges(text !== cardDetails.name);
              }}
            />
            {hasChanges && (
              <TouchableOpacity
                style={[styles.button, styles.buttonSave]}
                onPress={saveCardDetails}
              >
                <Text style={styles.textStyle}>Save Changes</Text>
              </TouchableOpacity>
            )}
            <Picker
              selectedValue={selectedMemberId}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedMemberId(itemValue)
              }
            >
              {members.map((member) => (
                <Picker.Item
                  key={member.id}
                  label={member.fullName}
                  value={member.id}
                />
              ))}
            </Picker>
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => setIsModalVisible(!isModalVisible)}
            >
              <Text style={styles.textStyle}>Close</Text>
            </TouchableOpacity>
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
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                if (listToDelete) confirmDeleteList(listToDelete);
              }}
            >
              <Text style={styles.textStyle}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => setIsDeleteModalVisible(false)}
            >
              <Text style={styles.textStyle}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalForCreatingCardVisible}
          onRequestClose={() => setIsModalForCreatingCardVisible(false)}
        >
          <View style={styles.modalView}>
            <TextInput
              style={styles.input}
              placeholder="New Card Name"
              value={newCardName}
              onChangeText={setNewCardName}
            />
            <Button title="Create A Card" onPress={createCard} />
            <Button
              title="Cancel"
              onPress={() => setIsModalForCreatingCardVisible(false)}
            />
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={!!cardToDelete}
          onRequestClose={() => setCardToDelete(null)}
        >
          <View style={styles.modalView}>
            <Text>Are you sure you want to delete this card?</Text>
            <Button title="Delete" onPress={deleteCard} />
            <Button title="Cancel" onPress={() => setCardToDelete(null)} />
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
