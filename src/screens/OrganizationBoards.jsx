import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
} from "react-native";
import axios from "axios";
import { API_KEY, TOKEN } from "@env";
import { useNavigation } from "@react-navigation/native";
import { RectButton, Swipeable } from "react-native-gesture-handler";

const OrganizationBoardsScreen = ({ route }) => {
  // state
  const { organizationId } = route.params;
  const [boards, setBoards] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newBoardName, setNewBoardName] = useState("");
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [selectedBoardForDelete, setSelectedBoardForDelete] = useState(null);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [selectedBoardForUpdate, setSelectedBoardForUpdate] = useState(null);
  const [updateBoardName, setUpdateBoardName] = useState("");

  const navigation = useNavigation();

  const fetchBoards = async () => {
    try {
      const boardsResponse = await axios.get(
        `https://api.trello.com/1/organizations/${organizationId}/boards?key=${API_KEY}&token=${TOKEN}`
      );
      const boardsData = boardsResponse.data;

      // Fetch members for each board
      const boardsWithMembers = await Promise.all(
        boardsData.map(async (board) => {
          const membersResponse = await axios.get(
            `https://api.trello.com/1/boards/${board.id}/members?key=${API_KEY}&token=${TOKEN}`
          );
          return { ...board, members: membersResponse.data }; // Attach members to the board object
        })
      );

      setBoards(boardsWithMembers);
    } catch (error) {
      console.error("Error fetching boards or members:", error);
    }
  };

  //[FEAT]: create a board
  const createBoard = async () => {
    if (newBoardName.trim()) {
      try {
        const response = await axios.post(
          `https://api.trello.com/1/boards/?name=${encodeURIComponent(
            newBoardName
          )}&key=${API_KEY}&token=${TOKEN}`
        );
        if (response.data) {
          setBoards([...boards, response.data]);
          setIsModalVisible(false);
        }
      } catch (error) {
        console.error("Error creating board: ", error);
      }
    } else {
      alert("Please enter a board name.");
    }
  };

  const updateBoard = async () => {
    if (updateBoardName.trim() && selectedBoardForUpdate) {
      try {
        const response = await axios.put(
          `https://api.trello.com/1/boards/${selectedBoardForUpdate}?key=${API_KEY}&token=${TOKEN}`,
          {
            name: updateBoardName,
          }
        );
        if (response.data) {
          const updatedBoards = boards.map((board) => {
            if (board.id === selectedBoardForUpdate) {
              return { ...board, name: updateBoardName };
            }
            return board;
          });
          setBoards(updatedBoards);
          setIsUpdateModalVisible(false);
          setUpdateBoardName("");
        }
      } catch (error) {
        console.error("Error updating board: ", error);
      }
    } else {
      alert("Please enter a new board name.");
    }
  };

  //[FEAT]: delete a board
  const confirmDeleteBoard = async (boardId) => {
    try {
      const response = await axios.delete(
        `https://api.trello.com/1/boards/${boardId}?key=${API_KEY}&token=${TOKEN}`
      );
      if (response.status === 200) {
        setBoards(boards.filter((brd) => brd.id !== boardId));
        setIsDeleteModalVisible(false);
      }
    } catch (error) {
      console.error("Error deleting board: ", error);
    }
  };

  const renderLeftActions = (progress, dragX, board) => {
    return (
      <RectButton
        style={[styles.actionButton, styles.editButton]}
        onPress={() => {
          setSelectedBoardForUpdate(board.id);
          setUpdateBoardName(board.name);
          setIsUpdateModalVisible(true);
        }}
      >
        <Text style={styles.actionButtonText}>Edit</Text>
      </RectButton>
    );
  };

  const renderRightActions = (progress, dragX, board) => {
    return (
      <RectButton
        style={[styles.actionButton, styles.deleteButton]}
        onPress={() => {
          setSelectedBoardForDelete(board.id);
          setIsDeleteModalVisible(true);
        }}
      >
        <Text style={styles.actionButtonText}>Del</Text>
      </RectButton>
    );
  };

  useEffect(() => {
    fetchBoards();
  }, [organizationId]);

  //[RETURN]: render the organization boards
  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setIsModalVisible(true)}
      >
        <Text style={styles.buttonText}>Create Board</Text>
      </TouchableOpacity>
      {boards.map((board, index) => (
        <Swipeable
          key={board.id}
          renderRightActions={(progress, dragX) =>
            renderRightActions(progress, dragX, board)
          }
          renderLeftActions={(progress, dragX) =>
            renderLeftActions(progress, dragX, board)
          }
        >
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() =>
              navigation.navigate("BoardLists", { boardId: board.id })
            }
          >
            <Text style={styles.cardTitle}>{board.name}</Text>
            <Text style={styles.cardSubtitle}>
              Members: {board.members.length}
            </Text>
          </TouchableOpacity>
        </Swipeable>
      ))}

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalView}>
          <TextInput
            style={styles.input}
            placeholder="New Workspace Name"
            value={newBoardName}
            onChangeText={setNewBoardName}
          />
          <Button title="Create Board" onPress={createBoard} />
          <Button title="Cancel" onPress={() => setIsModalVisible(false)} />
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isDeleteModalVisible}
        onRequestClose={() => setIsDeleteModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Text>Are you sure you want to delete this Board?</Text>
          <TouchableOpacity
            style={[styles.button, styles.buttonClose]}
            onPress={() => {
              if (selectedBoardForDelete)
                confirmDeleteBoard(selectedBoardForDelete);
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
        visible={isUpdateModalVisible}
        onRequestClose={() => {
          setIsUpdateModalVisible(false);
          setSelectedBoardForUpdate(null);
          setUpdateBoardName("");
        }}
      >
        <View style={styles.modalView}>
          <TextInput
            style={styles.input}
            placeholder="Edit Board Name"
            value={updateBoardName}
            onChangeText={setUpdateBoardName}
          />
          <Button title="Update Board" onPress={updateBoard} />
          <Button
            title="Cancel"
            onPress={() => {
              setIsUpdateModalVisible(false);
              setSelectedBoardForUpdate(null);
              setUpdateBoardName("");
            }}
          />
        </View>
      </Modal>
    </ScrollView>
  );
};

// [CSS]: styling

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
  actionButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    padding: 15,
  },
  editButton: {
    backgroundColor: "orange",
  },
  deleteButton: {
    backgroundColor: "red",
  },
  actionButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default OrganizationBoardsScreen;
