import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import * as FileSystem from "expo-file-system";
import { Storage } from "../components/Storage";

const darkTheme = Storage.getBoolean("darkTheme");

const LoadingScreen = ({ navigation }) => {
	let progress = 0;

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

	fileUrls.forEach((url) => {
		const fileName = url.split("/").slice(-1)[0];
		FileSystem.downloadAsync(url, FileSystem.documentDirectory + fileName).then(
			() => {
				progress++;
				if (progress == fileUrls.length) {
					navigation.goBack();
				} else {
					// pass
				}
			}
		);
	});

	return (
		<View style={styles.indicatorParentStyle}>
			<ActivityIndicator size={50} />
		</View>
	);
};

const styles = StyleSheet.create({
	indicatorParentStyle: {
		flex: 1,
		justifyContent: "center",
	},
});

export default LoadingScreen;
