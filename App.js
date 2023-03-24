import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import TabScreen from "./src/screens/TabScreen";
import WatchScreen from "./src/screens/WatchScreen";
import SelectScreen from "./src/screens/SelectScreen";
import GeneralSettingsScreen from "./src/screens/GeneralSettingsScreen";
import AboutScreen from "./src/screens/AboutScreen";
import LoadingScreen from "./src/screens/LoadingScreen";
import { Storage } from "./src/components/Storage";
import StartupScreen from "./src/screens/StartupScreen";
import WeCimaExtractionScreen from "./src/screens/WeCimaExtractionScreen";
import { getPaletteSync } from "@assembless/react-native-material-you";
import {
	Provider as PaperProvider,
	useTheme,
	MD3DarkTheme as DefaultTheme,
} from "react-native-paper";

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
				headerShadowVisible: false,
				contentStyle: { backgroundColor: theme.colors.background },
			}}>
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
					navigationBarHidden: true,
				}}
			/>
			<Stack.Screen
				name="Select"
				component={SelectScreen}
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
			<Stack.Screen
				name="WeCima Extraction"
				component={WeCimaExtractionScreen}
				options={{ headerShown: false, animation: "none" }}
			/>
			<Stack.Screen name="General Settings" component={GeneralSettingsScreen} />
			<Stack.Screen name="About" component={AboutScreen} />
		</Stack.Navigator>
	);
};

const App = () => {
	const palette = getPaletteSync();

	const theme = {
		...DefaultTheme,
		colors: {
			...DefaultTheme.colors,
			primary: palette.system_accent1[5],
			background: "black",
			elevation: {
				level4: palette.system_accent1[4] + "3C",
			},
			secondaryContainer: palette.system_accent1[4] + "3C",
		},
	};

	return (
		<PaperProvider theme={theme}>
			<NavigationContainer>
				<MyStack />
			</NavigationContainer>
		</PaperProvider>
	);
};

export default App;
