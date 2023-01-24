import React, { useState, useEffect } from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import TrendingContentScreen from "./TrendingContentScreen";
import { Storage } from "../components/Storage";
import SettingsScreen from "./SettingsScreen";
import WatchlistScreen from "./WatchlistScreen";
import * as FileSystem from "expo-file-system";
import WebView from "react-native-webview";
import { FASEL_EMAIL, FASEL_PASSWORD } from "@env";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Octicons, AntDesign } from "@expo/vector-icons";
import HeaderSearchIcon from "../components/HeaderSearchIcon";

const darkTheme = Storage.getBoolean("darkTheme");
const Tab = createBottomTabNavigator();

const TabScreen = ({ navigation }) => {
	const [contentUpdated, setContentUpdated] = useState(false);
	const [loggedin, setLoggedin] = useState(false);

	const jsCode = `
					if (document.getElementById('yorke_user_login')) {
						document.getElementById('yorke_user_login').value='${FASEL_EMAIL}';
						document.getElementById('yorke_user_pass').value='${FASEL_PASSWORD}';
						document.getElementById('yorke_login_submit').click();
					} else {
						// pass
					}
					`;

	const fileUrls = [
		"https://raw.githubusercontent.com/N0-0NE-Dev/no-fasel-scrapers/main/output/all-content.json",
		"https://raw.githubusercontent.com/N0-0NE-Dev/no-fasel-scrapers/main/output/anime.json",
		"https://raw.githubusercontent.com/N0-0NE-Dev/no-fasel-scrapers/main/output/asian-series.json",
		"https://raw.githubusercontent.com/N0-0NE-Dev/no-fasel-scrapers/main/output/movies.json",
		"https://raw.githubusercontent.com/N0-0NE-Dev/no-fasel-scrapers/main/output/series.json",
		"https://raw.githubusercontent.com/N0-0NE-Dev/no-fasel-scrapers/main/output/trending-content.json",
		"https://raw.githubusercontent.com/N0-0NE-Dev/no-fasel-scrapers/main/output/tvshows.json",
		"https://raw.githubusercontent.com/N0-0NE-Dev/no-fasel-scrapers/main/output/arabic-series.json",
		"https://raw.githubusercontent.com/N0-0NE-Dev/no-fasel-scrapers/main/output/arabic-movies.json",
		"https://raw.githubusercontent.com/N0-0NE-Dev/no-fasel-scrapers/main/output/last-scraped.txt",
	];

	let progress = 0;

	if (!Storage.contains("contentAutoupdate")) {
		Storage.set("contentAutoupdate", true);
	} else {
		// pass
	}

	if (!Storage.contains("useProxy")) {
		Storage.set("useProxy", false);
	} else {
		// pass
	}

	if (!Storage.contains("resume")) {
		Storage.set("resume", JSON.stringify({}));
	} else {
		// pass
	}

	const contentAutoupdate = Storage.getBoolean("contentAutoupdate");

	const updateContent = () => {
		fileUrls.forEach((url) => {
			const fileName = url.split("/").slice(-1)[0];
			FileSystem.downloadAsync(
				url,
				FileSystem.documentDirectory + fileName
			).then(() => {
				progress++;
				if (progress == fileUrls.length) {
					setContentUpdated(true);
				} else {
					// pass
				}
			});
		});
	};

	const handleContentUpdate = () => {
		fetch(
			"https://raw.githubusercontent.com/N0-0NE-Dev/no-fasel-scrapers/main/output/last-scraped.txt"
		)
			.then((response) => response.text())
			.then((text) => {
				const newestDate = new Date(text);
				FileSystem.readAsStringAsync(
					FileSystem.documentDirectory + "last-scraped.txt"
				)
					.then((date) => {
						const currentDate = new Date(date);

						if (newestDate > currentDate) {
							updateContent();
						} else {
							setContentUpdated(true);
						}
					})
					.catch(() => updateContent());
			});
	};

	useEffect(() => {
		if (contentAutoupdate) {
			handleContentUpdate();
		} else {
			// pass
		}
	}, []);

	const handleNavigationChange = (webViewState) => {
		if (webViewState.url.includes("home3")) {
			setLoggedin(true);
		} else {
			// pass
		}
	};

	if (contentUpdated && loggedin) {
		return (
			<Tab.Navigator
				initialRouteName="Trending"
				sceneContainerStyle={{
					backgroundColor: darkTheme ? "#18191a" : "#eee",
				}}
				screenOptions={{
					headerStyle: { backgroundColor: darkTheme ? "black" : "white" },
					headerTintColor: darkTheme ? "white" : "black",
					tabBarStyle: { backgroundColor: darkTheme ? "black" : "white" },
				}}
			>
				<Tab.Screen
					name="Trending"
					component={TrendingContentScreen}
					options={{
						tabBarIcon: ({ focused }) => (
							<Octicons
								name="flame"
								size={22}
								color={focused ? "orange" : darkTheme ? "white" : "black"}
							/>
						),
						headerRight: () => <HeaderSearchIcon navigation={navigation} />,
						tabBarActiveTintColor: "orange",
					}}
				/>
				<Tab.Screen
					name="Watchlist"
					component={WatchlistScreen}
					options={{
						tabBarIcon: ({ focused }) => (
							<AntDesign
								name="star"
								size={22}
								color={focused ? "gold" : darkTheme ? "white" : "black"}
							/>
						),
						headerRight: () => <HeaderSearchIcon navigation={navigation} />,
						tabBarActiveTintColor: "gold",
					}}
				/>
				<Tab.Screen
					name="Settings"
					component={SettingsScreen}
					options={{
						tabBarIcon: ({ focused }) => (
							<AntDesign
								name="setting"
								size={22}
								color={focused ? "#1a6fc9" : darkTheme ? "white" : "black"}
							/>
						),
					}}
				/>
			</Tab.Navigator>
		);
	} else {
		return (
			<View style={styles.indicatorParentStyle}>
				<ActivityIndicator size={50} />
				<View>
					<WebView
						source={{ uri: "https://www.faselhd.club/account/login" }}
						injectedJavaScript={jsCode}
						sharedCookiesEnabled={true}
						onNavigationStateChange={handleNavigationChange}
					/>
				</View>
			</View>
		);
	}
};

const styles = StyleSheet.create({
	indicatorParentStyle: {
		flex: 1,
		justifyContent: "center",
	},
});

export default TabScreen;
