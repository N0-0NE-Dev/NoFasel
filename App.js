import "expo-dev-client";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import TabScreen from "./src/screens/TabScreen";
import WatchScreen from "./src/screens/WatchScreen";
import NewSelectScreen from "./src/screens/NewSelectScreen";
import { Provider as PaperProvider, useTheme } from "react-native-paper";
import GeneralSettingsScreen from "./src/screens/GeneralSettingsScreen";
import AboutScreen from "./src/screens/AboutScreen";
import LoadingScreen from "./src/screens/LoadingScreen";
import { Storage } from "./src/components/Storage";
import StartupScreen from "./src/screens/StartupScreen";

const Stack = createNativeStackNavigator();

const MyStack = () => {
	const theme = useTheme();

	return (
		<Stack.Navigator
			initialRouteName={Storage.contains("provider") ? "Tab" : "Startup"}
			screenOptions={{
				statusBarColor: theme.dark ? "black" : "white",
				statusBarStyle: theme.dark ? "light" : "dark",
				headerStyle: { backgroundColor: theme.colors.background },
				headerTintColor: theme.dark ? "white" : "black",
				navigationBarHidden: true,
				headerShadowVisible: false,
				contentStyle: { backgroundColor: theme.colors.background },
			}}
		>
			<Stack.Screen
				name="Tab"
				component={TabScreen}
				options={{
					headerShown: false,
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
				name="New Select"
				component={NewSelectScreen}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="Loading"
				component={LoadingScreen}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="Startup"
				component={StartupScreen}
				options={{ headerShown: false }}
			/>
			<Stack.Screen name="General Settings" component={GeneralSettingsScreen} />
			<Stack.Screen name="About" component={AboutScreen} />
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
