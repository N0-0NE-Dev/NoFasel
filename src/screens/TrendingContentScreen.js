import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, ActivityIndicator, View } from "react-native";
import * as FileSystem from "expo-file-system";
import TrendingContentSection from "../components/TrendingContentSection";

const TrendingContentScreen = ({ navigation }) => {
	const [data, setData] = useState(null);

	useEffect(() => {
		FileSystem.readAsStringAsync(
			FileSystem.documentDirectory + "trending-content.json"
		).then((data) => setData(JSON.parse(data)));
	}, []);

	if (data) {
		return (
			<ScrollView>
				<TrendingContentSection
					data={data.movies}
					title="Movies"
					category="movies"
					navigation={navigation}
				/>

				<TrendingContentSection
					data={data.series}
					title="Series"
					category="series"
					navigation={navigation}
				/>

				<TrendingContentSection
					data={data.anime}
					title="Anime"
					category="anime"
					navigation={navigation}
				/>

				<TrendingContentSection
					data={data["asian-series"]}
					title="Asian Series"
					category="asian-series"
					navigation={navigation}
				/>

				<TrendingContentSection
					data={data["arabic-series"]}
					title="Arabic Series"
					category="arabic-series"
					navigation={navigation}
				/>

				<TrendingContentSection
					data={data["arabic-movies"]}
					title="Arabic Movies"
					category="arabic-movies"
					navigation={navigation}
				/>
			</ScrollView>
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

export default TrendingContentScreen;
