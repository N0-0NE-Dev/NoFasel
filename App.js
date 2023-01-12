import "expo-dev-client";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import TabScreen from "./src/screens/TabScreen";
import SelectScreen from "./src/screens/SelectScreen";
import WatchScreen from "./src/screens/WatchScreen";
import LoadingScreen from "./src/screens/LoadingScreen";
import { Storage } from "./src/components/Storage";
import AllContentScreen from "./src/screens/AllContentScreen";

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
			initialRouteName="Tab"
			screenOptions={{
				statusBarColor: darkTheme ? "black" : "white",
				statusBarStyle: darkTheme ? "light" : "dark",
				headerStyle: { backgroundColor: darkTheme ? "black" : "white" },
				headerTintColor: darkTheme ? "white" : "black",
				contentStyle: { backgroundColor: darkTheme ? "#18191a" : "#eee" },
				navigationBarHidden: true,
			}}
		>
			<Stack.Screen
				name="Tab"
				component={TabScreen}
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
				name="All Content"
				component={AllContentScreen}
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
					statusBarHidden: true,
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
