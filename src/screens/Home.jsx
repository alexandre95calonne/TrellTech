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

export default function HomeScreen() {
  const [organizations, setOrganizations] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newOrgName, setNewOrgName] = useState("");

  const navigation = useNavigation();

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
});
