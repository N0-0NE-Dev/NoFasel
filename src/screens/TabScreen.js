import React, { useState, useEffect } from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import TrendingContentScreen from "./TrendingContentScreen";
import { Storage } from "../components/Storage";
import SettingsScreen from "./SettingsScreen";
import WatchlistScreen from "./WatchlistScreen";
import * as FileSystem from "expo-file-system";
import WebView from "react-native-webview";
import { FASEL_EMAIL, FASEL_PASSWORD } from "@env";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import HeaderSearchIcon from "../components/HeaderSearchIcon";
import SearchScreen from "./SearchScreen";
import { BottomNavigation } from "react-native-paper";

const darkTheme = Storage.getBoolean("darkTheme");

const TabScreen = ({ navigation }) => {
	const [contentUpdated, setContentUpdated] = useState(false);
	const [loggedin, setLoggedin] = useState(false);
	const [index, setIndex] = useState(0);
	const [routes] = useState([
		{
			key: "home",
			title: "Home",
			focusedIcon: "home",
			unfocusedIcon: "home-outline",
		},
		{
			key: "explore",
			title: "Explore",
			focusedIcon: "compass",
			unfocusedIcon: "compass-outline",
		},
		{
			key: "mylist",
			title: "My List",
			focusedIcon: "bookmark-minus",
			unfocusedIcon: "bookmark-minus-outline",
		},
		{
			key: "settings",
			title: "Settings",
			focusedIcon: "cog",
			unfocusedIcon: "cog-outline",
		},
	]);

	const renderScene = BottomNavigation.SceneMap({
		home: () => {
			return <TrendingContentScreen navigation={navigation} />;
		},
		explore: () => {
			return <SearchScreen navigation={navigation} />;
		},
		mylist: () => {
			<WatchlistScreen navigation={navigation} />;
		},
		settings: () => {
			return <SettingsScreen navigation={navigation} />;
		},
	});

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
		"https://raw.githubusercontent.com/N0-0NE-Dev/no-fasel-scrapers/main/output/featured-content.json",
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
			<BottomNavigation
				navigationState={{ index, routes }}
				onIndexChange={setIndex}
				renderScene={renderScene}
				activeColor="red"
				shifting={true}
				theme={{ colors: { secondaryContainer: "rgba(0, 0, 0, 0)" } }}
				barStyle={{ backgroundColor: "#ffffff" }}
			/>
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
