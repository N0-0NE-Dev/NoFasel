import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, Text, ActivityIndicator } from "react-native";
import ContentCardsList from "../components/ContentCardsList";
import * as FileSystem from "expo-file-system";
import { StatusBar } from "expo-status-bar";

const TrendingContentScreen = ({ navigation }) => {
	const [data, setData] = useState(null);

	useEffect(() => {
		FileSystem.readAsStringAsync(
			FileSystem.documentDirectory + "trending-content.json"
		).then((data) => setData(JSON.parse(data)));
	});

	if (data) {
		return (
			<ScrollView>
				<StatusBar style="dark" />
				<Text style={styles.sectionTitleStyle}>Movies</Text>
				<ContentCardsList
					data={Object.entries(data.movies)}
					navigation={navigation}
					horizontal={true}
				/>

				<Text style={styles.sectionTitleStyle}>Series</Text>
				<ContentCardsList
					data={Object.entries(data.series)}
					navigation={navigation}
					horizontal={true}
				/>

				<Text style={styles.sectionTitleStyle}>Anime</Text>
				<ContentCardsList
					data={Object.entries(data.anime)}
					navigation={navigation}
					horizontal={true}
				/>

				<Text style={styles.sectionTitleStyle}>Asian Series</Text>
				<ContentCardsList
					data={Object.entries(data["asian-series"])}
					navigation={navigation}
					horizontal={true}
				/>

				<Text style={styles.sectionTitleStyle}>Arabic Series</Text>
				<ContentCardsList
					data={Object.entries(data["arabic-series"])}
					navigation={navigation}
					horizontal={true}
				/>
			</ScrollView>
		);
	} else {
		return <ActivityIndicator size={50} />;
	}
};

const styles = StyleSheet.create({
	sectionTitleStyle: {
		fontSize: 20,
		fontWeight: "bold",
		marginLeft: 10,
		marginVertical: 10,
		color: "black",
	},
});

export default TrendingContentScreen;
