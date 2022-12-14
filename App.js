import "expo-dev-client";
import "react-native-gesture-handler";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import DrawerScreen from "./src/screens/DrawerScreen";
import SelectScreen from "./src/screens/SelectScreen";
import WatchScreen from "./src/screens/WatchScreen";
import LoadingScreen from "./src/screens/LoadingScreen";
import SearchScreen from "./src/screens/SearchScreen";
import { Storage } from "./src/components/Storage";

if (!Storage.contains("darkTheme")) {
	Storage.set("darkTheme", false);
} else {
	// pass
}

const darkTheme = Storage.getBoolean("darkTheme");
const Stack = createNativeStackNavigator();

const MyStack = () => {
	return (
		<Stack.Navigator
			initialRouteName="Drawer"
			screenOptions={{
				statusBarColor: darkTheme ? "black" : "white",
				statusBarStyle: darkTheme ? "light" : "dark",
				headerStyle: { backgroundColor: darkTheme ? "black" : "white" },
				headerTintColor: darkTheme ? "white" : "black",
				contentStyle: { backgroundColor: darkTheme ? "#18191a" : "#eee" },
			}}
		>
			<Stack.Screen
				name="Drawer"
				component={DrawerScreen}
				options={{
					headerShown: false,
					orientation: "all",
				}}
			/>
			<Stack.Screen
				name="Select"
				component={SelectScreen}
				options={{
					orientation: "all",
				}}
			/>
			<Stack.Screen
				name="Watch"
				component={WatchScreen}
				options={{
					headerShown: false,
					orientation: "all",
				}}
			/>
			<Stack.Screen
				name="Loading"
				component={LoadingScreen}
				options={{
					headerShown: false,
					orientation: "all",
				}}
			/>
			<Stack.Screen
				name="Search"
				component={SearchScreen}
				options={{
					orientation: "all",
				}}
			/>
		</Stack.Navigator>
	);
};

const App = () => {
	return (
		<NavigationContainer>
			<MyStack />
		</NavigationContainer>
	);
};

export default App;
