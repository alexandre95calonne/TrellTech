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

export default function HomeScreen() {
  const [organizations, setOrganizations] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [swipeableRow, setSwipeableRow] = useState(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [selectedOrgForDelete, setSelectedOrgForDelete] = useState(null);
  const [newOrgName, setNewOrgName] = useState("");
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [selectedOrgForUpdate, setSelectedOrgForUpdate] = useState(null);
  const [updateOrgName, setUpdateOrgName] = useState("");
  const [updateOrgShortName, setUpdateOrgShortName] = useState("");

  const navigation = useNavigation();

  const fetchOrganizations = async () => {
    try {
      const orgsResponse = await axios.get(
        `https://api.trello.com/1/members/me/organizations?key=${API_KEY}&token=${TOKEN}`
      );
      const orgsData = orgsResponse.data;

      // Fetch members for each organization
      const orgsWithMembers = await Promise.all(
        orgsData.map(async (org) => {
          const membersResponse = await axios.get(
            `https://api.trello.com/1/organizations/${org.id}/members?key=${API_KEY}&token=${TOKEN}`
          );
          return { ...org, members: membersResponse.data }; // Attach members to the organization object
        })
      );

      setOrganizations(orgsWithMembers);
    } catch (error) {
      console.error("Error fetching organizations or members: ", error);
    }
  };

  const createOrganization = async () => {
    if (newOrgName.trim()) {
      try {
        const response = await axios.post(
          `https://api.trello.com/1/organizations?displayName=${encodeURIComponent(
            newOrgName
          )}&key=${API_KEY}&token=${TOKEN}`
        );
        if (response.data) {
          setOrganizations([...organizations, response.data]);
          setIsModalVisible(false);
        }
      } catch (error) {
        console.error("Error creating organization: ", error);
      }
    } else {
      alert("Please enter an organization name.");
    }
  };

  const updateOrganization = async () => {
    if (
      selectedOrgForUpdate &&
      updateOrgName.trim() &&
      updateOrgShortName.trim()
    ) {
      try {
        const response = await axios.put(
          `https://api.trello.com/1/organizations/${selectedOrgForUpdate}?key=${API_KEY}&token=${TOKEN}`,
          {
            displayName: updateOrgName,
            name: updateOrgShortName,
          }
        );
        if (response.data) {
          const updatedOrgs = organizations.map((org) => {
            if (org.id === selectedOrgForUpdate) {
              return {
                ...org,
                displayName: updateOrgName,
                name: updateOrgShortName,
              };
            }
            return org;
          });
          setOrganizations(updatedOrgs);
          setIsUpdateModalVisible(false);
        }
      } catch (error) {
        console.error("Error updating organization: ", error);
      }
    } else {
      alert(
        "Please enter both a new display name and a new name for the workspace."
      );
    }
  };

  const confirmDeleteOrganization = async (organizationId) => {
    try {
      const response = await axios.delete(
        `https://api.trello.com/1/organizations/${organizationId}?key=${API_KEY}&token=${TOKEN}`
      );
      if (response.status === 200) {
        setOrganizations(
          organizations.filter((org) => org.id !== organizationId)
        );
        setIsDeleteModalVisible(false);
      }
    } catch (error) {
      console.error("Error deleting organization: ", error);
    }
  };

  const renderLeftActions = (progress, dragX, organization) => {
    return (
      <RectButton
        style={[styles.actionButton, styles.editButton]}
        onPress={() => {
          setSelectedOrgForUpdate(organization.id);
          setIsUpdateModalVisible(true);
        }}
      >
        <Text style={styles.actionButtonText}>Edit</Text>
      </RectButton>
    );
  };

  const renderRightActions = (progress, dragX, organization) => {
    return (
      <RectButton
        style={[styles.actionButton, styles.deleteButton]}
        onPress={() => {
          setSelectedOrgForDelete(organization.id);
          setIsDeleteModalVisible(true);
        }}
      >
        <Text style={styles.actionButtonText}>Delete</Text>
      </RectButton>
    );
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setIsModalVisible(true)}
      >
        <Text style={styles.buttonText}>Create Workspace</Text>
      </TouchableOpacity>
      {organizations.map((organization, index) => (
        <Swipeable
          key={organization.id}
          renderLeftActions={(progress, dragX) =>
            renderLeftActions(progress, dragX, organization)
          }
          renderRightActions={(progress, dragX) =>
            renderRightActions(progress, dragX, organization)
          }
        >
          <TouchableOpacity
            style={styles.card}
            onPress={() => {
              swipeableRow && swipeableRow.close();
              navigation.navigate("Boards", {
                organizationId: organization.id,
              });
            }}
          >
            <Text style={styles.cardTitle}>
              {organization.displayName || "No Name"}
            </Text>
            {/* Display the number of members here */}
            <Text style={styles.cardSubtitle}>
              Members: {organization.members.length}
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
            value={newOrgName}
            onChangeText={setNewOrgName}
          />
          <Button title="Create" onPress={createOrganization} />
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
          <Text>Are you sure you want to delete this workspace?</Text>
          <TouchableOpacity
            style={[styles.button, styles.buttonClose]}
            onPress={() => {
              if (selectedOrgForDelete)
                confirmDeleteOrganization(selectedOrgForDelete);
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
        onRequestClose={() => setIsUpdateModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput
              style={styles.input}
              placeholder="New Workspace Display Name"
              value={updateOrgName}
              onChangeText={setUpdateOrgName}
            />
            <TextInput
              style={styles.input}
              placeholder="New Workspace Short Name"
              value={updateOrgShortName}
              onChangeText={setUpdateOrgShortName}
            />
            <TouchableOpacity
              style={[styles.button, styles.buttonUpdate]}
              onPress={updateOrganization}
            >
              <Text style={styles.textStyle}>Update</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => setIsUpdateModalVisible(false)}
            >
              <Text style={styles.textStyle}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  deleteButton: {
    backgroundColor: "#FF3B30",
    justifyContent: "center",
    alignItems: "center",
    width: 90,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  deleteButtonText: {
    color: "#fff",
    padding: 20,
    fontWeight: "600",
    fontSize: 16,
  },
  actionButton: {
    flex: 1,
    justifyContent: "center",
    padding: 15,
  },
  deleteButton: {
    backgroundColor: "red",
  },
  updateButton: {
    backgroundColor: "orange",
  },
  actionButtonText: {
    color: "white",
    fontSize: 16,
    padding: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
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
