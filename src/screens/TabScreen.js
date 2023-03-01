import React, { useState } from "react";
import TrendingContentScreen from "./TrendingContentScreen";
import { Storage } from "../components/Storage";
import WatchlistScreen from "./WatchlistScreen";
import * as FileSystem from "expo-file-system";
import SearchScreen from "./SearchScreen";
import NewSettingsScreen from "./NewSettingsScreen";
import { BottomNavigation } from "react-native-paper";
import CentredActivityIndicator from "../components/CentredActivityIndicator";

const TabScreen = ({ navigation }) => {
	let progress = 0;
	const provider = Storage.getString("provider");
	const common = require("../data/common.json");
	const [contentUpdated, setContentUpdated] = useState(false);
	const [index, setIndex] = useState(0);

	const fileUrls =
		provider == "fasel" ? common.fileUrlsFasel : common.fileUrlsHdw;

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
			return <WatchlistScreen navigation={navigation} />;
		},
		settings: () => {
			return <NewSettingsScreen navigation={navigation} />;
		},
	});

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

	if (!Storage.contains("watchlist")) {
		Storage.set("watchlist", JSON.stringify({}));
	} else {
		// pass
	}

	if (contentUpdated) {
		return (
			<BottomNavigation
				navigationState={{ index, routes }}
				onIndexChange={setIndex}
				renderScene={renderScene}
				shifting={true}
			/>
		);
	} else {
		return <CentredActivityIndicator />;
	}
};

export default TabScreen;
