import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import axios from "axios";
import OrganizationBoardsScreen from "../../src/screens/OrganizationBoards";
import { NavigationContainer } from "@react-navigation/native";

jest.mock("axios");

jest.mock("react-native-gesture-handler", () => ({
  RectButton: "RectButton",
  Swipeable: "Swipeable",
}));

describe("OrganizationBoardsScreen", () => {
  it("fetches and displays boards for the given organization on mount", async () => {
    axios.get.mockResolvedValue({
      data: [
        { id: 1, name: "Board 1", members: [] },
        { id: 2, name: "Board 2", members: [] },
      ],
    });

    const route = {
      params: {
        organizationId: "test-org-id",
      },
    };

    const { getByText } = render(
      <NavigationContainer>
        <OrganizationBoardsScreen route={route} />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText("Board 1")).toBeTruthy();
      expect(getByText("Board 2")).toBeTruthy();
    });
  });
});

// this test test the several methods of OrganizationBoard to ensure it well fetch and display the data with the several api calls
