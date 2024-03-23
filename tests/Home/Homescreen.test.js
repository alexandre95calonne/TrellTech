import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import axios from "axios";
import HomeScreen from "../../src/screens/Home";

jest.mock("axios");
jest.mock("@react-navigation/native", () => {
  return {
    ...jest.requireActual("@react-navigation/native"),
    useNavigation: () => ({
      navigate: jest.fn(),
    }),
  };
});
jest.mock("react-native-gesture-handler", () => ({
  RectButton: "RectButton",
  Swipeable: "Swipeable",
}));

describe("HomeScreen", () => {
  it("fetches organizations and updates state on mount", async () => {
    const mockOrgs = [{ id: 1, displayName: "Org 1", members: [] }];
    axios.get.mockResolvedValue({ data: mockOrgs });

    const { getByText } = render(<HomeScreen />);

    await waitFor(() => {
      expect(getByText("Org 1")).toBeTruthy();
    });
  });
});

// this test is testing that the call api is well done and that the component and data is well rendering
