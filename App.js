import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./src/screens/Home";
import BoardListsScreen from "./src/screens/Board";
import OrganizationBoardsScreen from "./src/screens/OrganizationBoards";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="TrellTech" component={HomeScreen} />
        <Stack.Screen name="BoardLists" component={BoardListsScreen} />
        <Stack.Screen name="Boards" component={OrganizationBoardsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
