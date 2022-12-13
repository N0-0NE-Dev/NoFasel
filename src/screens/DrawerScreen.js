import React, { useState, useEffect } from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import TrendingContentScreen from "./TrendingContentScreen";
import { Storage } from "../components/Storage";
import SettingsScreen from "./SettingsScreen";
import AllContentScreen from "./AllContentScreen";
import WatchlistScreen from "./WatchlistScreen";
import * as FileSystem from "expo-file-system";
import HeaderSearchIcon from "../components/HeaderSearchIcon";

const darkTheme = Storage.getBoolean("darkTheme");
const Drawer = createDrawerNavigator();

const DrawerScreen = ({ navigation }) => {
	const [contentUpdated, setContentUpdated] = useState(false);

	const fileUrls = [
		"https://raw.githubusercontent.com/N0-0NE-Dev/no-fasel-scrapers/main/output/all-content.json",
		"https://raw.githubusercontent.com/N0-0NE-Dev/no-fasel-scrapers/main/output/anime.json",
		"https://raw.githubusercontent.com/N0-0NE-Dev/no-fasel-scrapers/main/output/asian-series.json",
		"https://raw.githubusercontent.com/N0-0NE-Dev/no-fasel-scrapers/main/output/movies.json",
		"https://raw.githubusercontent.com/N0-0NE-Dev/no-fasel-scrapers/main/output/series.json",
		"https://raw.githubusercontent.com/N0-0NE-Dev/no-fasel-scrapers/main/output/trending-content.json",
		"https://raw.githubusercontent.com/N0-0NE-Dev/no-fasel-scrapers/main/output/tvshows.json",
		"https://raw.githubusercontent.com/N0-0NE-Dev/no-fasel-scrapers/main/output/arabic-series.json",
		"https://raw.githubusercontent.com/N0-0NE-Dev/no-fasel-scrapers/main/output/last-scraped.txt",
	];

	let progress = 0;

	if (!Storage.contains("contentAutoupdate")) {
		Storage.set("contentAutoupdate", true);
	} else {
		// pass
	}

	if (!Storage.contains("useProxy")) {
		Storage.set("useProxy", true);
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

	if (contentUpdated) {
		return (
			<Drawer.Navigator
				initialRouteName="Trending"
				screenOptions={{
					statusBarColor: darkTheme ? "black" : "white",
					statusBarStyle: darkTheme ? "light" : "dark",
					headerStyle: { backgroundColor: darkTheme ? "black" : "white" },
					headerTintColor: darkTheme ? "white" : "black",
					drawerStyle: { backgroundColor: darkTheme ? "black" : "white" },
					drawerInactiveTintColor: darkTheme ? "white" : "black",
					sceneContainerStyle: {
						backgroundColor: darkTheme ? "#18191a" : "#eee",
					},
				}}
			>
				<Drawer.Screen
					name="Trending"
					component={TrendingContentScreen}
					options={{
						headerRight: () => <HeaderSearchIcon navigation={navigation} />,
					}}
				/>
				<Drawer.Screen
					name="All Content"
					component={AllContentScreen}
					options={{
						headerRight: () => <HeaderSearchIcon navigation={navigation} />,
					}}
				/>
				<Drawer.Screen
					name="Watchlist"
					component={WatchlistScreen}
					options={{
						headerRight: () => <HeaderSearchIcon navigation={navigation} />,
					}}
				/>
				<Drawer.Screen name="Settings" component={SettingsScreen} />
			</Drawer.Navigator>
		);
	} else {
		return (
			<View style={styles.indicatorParentStyle}>
				<ActivityIndicator size={50} />
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

export default DrawerScreen;
