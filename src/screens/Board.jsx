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
import Icon from "react-native-vector-icons/FontAwesome";

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
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editListName, setEditListName] = useState("");
  const [listToEdit, setListToEdit] = useState(null);

  const archiveList = async (listId) => {
    try {
      const response = await axios.put(
        `https://api.trello.com/1/lists/${listId}/closed?key=${API_KEY}&token=${TOKEN}`,
        {
          value: true,
        }
      );
      if (response.data && response.status === 200) {
        const updatedLists = lists.filter((list) => list.id !== listId);
        setLists(updatedLists);
      }
    } catch (error) {
      console.error("Error archiving list:", error);
    }
  };

  const archiveCard = async (cardId) => {
    try {
      const response = await axios.put(
        `https://api.trello.com/1/cards/${cardId}?key=${API_KEY}&token=${TOKEN}`,
        { closed: true }
      );
      if (
        response.data &&
        (response.status === 200 || response.status === 204)
      ) {
        const updatedLists = lists.map((list) => {
          list.cards = list.cards.filter((card) => card.id !== cardId);
          return list;
        });
        setLists(updatedLists);
        setIsModalVisible(false);
      }
    } catch (error) {
      console.error("Error archiving card:", error);
    }
  };

  const editListDetails = async (listId, newName) => {
    try {
      const response = await axios.put(
        `https://api.trello.com/1/lists/${listId}?key=${API_KEY}&token=${TOKEN}`,
        {
          name: newName,
        }
      );
      if (response.data) {
        const updatedLists = lists.map((list) => {
          if (list.id === listId) {
            return { ...list, name: newName };
          }
          return list;
        });
        setLists(updatedLists);

        console.log("List name updated successfully.");
      }
    } catch (error) {
      console.error("Error updating list name:", error);
    }
  };

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

  useEffect(() => {
    fetchListsAndCards();

    fetchBoardDetails();
  }, [boardId]);

  useEffect(() => {
    if (orgId) {
      fetchOrgMembers();
    }
    console.log(members);
  }, [orgId]);

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        style={styles.createListButton}
        onPress={() => setIsModalForCreatingList(true)}
      >
        <View style={styles.createListContent}>
          <Icon
            name="plus"
            size={20}
            color="#007bff"
            style={styles.createListIcon}
          />
          <Text style={styles.createListText}>Create a List</Text>
        </View>
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
            <View style={styles.listHeader}>
              <Text style={styles.listTitle}>{list.name}</Text>
              <View style={styles.iconsContainer}>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => {
                    setListToDelete(list.id);
                    setIsDeleteModalVisible(true);
                  }}
                >
                  <Icon name="trash" size={20} color="#dc3545" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => {
                    setListForNewCard(list.id);
                    setIsModalForCreatingCardVisible(true);
                  }}
                >
                  <Icon name="plus" size={20} color="#007bff" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => {
                    setListToEdit(list.id);
                    setEditListName(list.name);
                    setIsEditModalVisible(true);
                  }}
                >
                  <Icon name="edit" size={20} color="#ffc107" />
                </TouchableOpacity>
              </View>
            </View>

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
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                value={editableCardDetails?.name}
                onChangeText={(text) => {
                  setEditableCardDetails({
                    ...editableCardDetails,
                    name: text,
                  });
                  setHasChanges(text !== cardDetails.name);
                }}
              />
              <TouchableOpacity
                style={styles.archiveIcon}
                onPress={() => archiveCard(editableCardDetails.id)}
              >
                <Icon name="archive" size={20} color="#6c757d" />
              </TouchableOpacity>
            </View>

            {hasChanges && (
              <TouchableOpacity
                style={[styles.button, styles.buttonSave]}
                onPress={saveCardDetails}
              >
                <Text style={styles.textStyle}>Save Changes</Text>
              </TouchableOpacity>
            )}

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
            <Text>Are you sure you want to archive this list?</Text>
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                if (listToDelete) {
                  archiveList(listToDelete);
                  setIsDeleteModalVisible(false);
                }
              }}
            >
              <Text style={styles.textStyle}>Archive</Text>
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
          visible={isEditModalVisible}
          onRequestClose={() => setIsEditModalVisible(false)}
        >
          <View style={styles.modalView}>
            <TextInput
              style={styles.input}
              placeholder="Edit List Name"
              value={editListName}
              onChangeText={setEditListName}
            />
            <Button
              title="Save Changes"
              onPress={() => {
                editListDetails(listToEdit, editListName);
                setIsEditModalVisible(false);
              }}
            />
            <Button
              title="Cancel"
              onPress={() => setIsEditModalVisible(false)}
            />
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

styles.listHeader = {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 10,
};

styles.iconsContainer = {
  flexDirection: "row",
  alignItems: "center",
};

styles.iconButton = {
  marginLeft: 10,
};

styles.createListButton = {
  flexDirection: "row",
  alignItems: "center",
  paddingVertical: 10,
  paddingHorizontal: 15,
  marginVertical: 10,
  backgroundColor: "#f0f0f0",
  borderRadius: 20,
  shadowOpacity: 0.1,
  shadowRadius: 5,
  shadowColor: "#000",
  shadowOffset: { height: 0, width: 0 },
  elevation: 3,
};

styles.createListContent = {
  flexDirection: "row",
  alignItems: "center",
};

styles.createListIcon = {
  marginRight: 5,
};

styles.createListText = {
  color: "#007bff",
  fontWeight: "bold",
};

styles.inputContainer = {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 10,
};

styles.archiveIcon = {
  padding: 10,
};

export default BoardListsScreen;
