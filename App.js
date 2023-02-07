import "expo-dev-client";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import TabScreen from "./src/screens/TabScreen";
import SelectScreen from "./src/screens/SelectScreen";
import WatchScreen from "./src/screens/WatchScreen";
import LoadingScreen from "./src/screens/LoadingScreen";
import AllContentScreen from "./src/screens/AllContentScreen";
import NewSelectScreen from "./src/screens/NewSelectScreen";
import { Provider as PaperProvider, useTheme } from "react-native-paper";

const Stack = createNativeStackNavigator();

const MyStack = () => {
	const theme = useTheme();

	return (
		<Stack.Navigator
			initialRouteName="Tab"
			screenOptions={{
				statusBarColor: theme.dark ? "black" : "white",
				statusBarStyle: theme.dark ? "light" : "dark",
				headerStyle: { backgroundColor: theme.dark ? "black" : "white" },
				headerTintColor: theme.dark ? "white" : "black",
				navigationBarHidden: true,
			}}
		>
			<Stack.Screen
				name="Tab"
				component={TabScreen}
				options={{
					headerShown: false,
					orientation: "default",
				}}
			/>
			<Stack.Screen
				name="Select"
				component={SelectScreen}
				options={{
					orientation: "default",
				}}
			/>
			<Stack.Screen
				name="All Content"
				component={AllContentScreen}
				options={{
					orientation: "default",
				}}
			/>
			<Stack.Screen
				name="Watch"
				component={WatchScreen}
				options={{
					headerShown: false,
					orientation: "all",
					statusBarHidden: true,
				}}
			/>
			<Stack.Screen
				name="Loading"
				component={LoadingScreen}
				options={{
					headerShown: false,
					orientation: "default",
				}}
			/>
			<Stack.Screen
				name="New Select"
				component={NewSelectScreen}
				options={{
					headerShown: false,
					orientation: "default",
				}}
			/>
		</Stack.Navigator>
	);
};

const App = () => {
	return (
		<PaperProvider>
			<NavigationContainer>
				<MyStack />
			</NavigationContainer>
		</PaperProvider>
	);
};

export default App;
