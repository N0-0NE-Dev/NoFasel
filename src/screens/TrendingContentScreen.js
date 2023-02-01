import React, { useState, useEffect } from "react";
import { StyleSheet, ActivityIndicator, View, ScrollView } from "react-native";
import * as FileSystem from "expo-file-system";
import TrendingContentSection from "../components/TrendingContentSection";
import FeaturedContentCardList from "../components/FeaturedContentCardList";

const TrendingContentScreen = ({ navigation }) => {
	const [data, setData] = useState(null);

	const listData = [
		{ category: "movies", title: "Movies" },
		{ category: "series", title: "Series" },
		{ category: "anime", title: "Anime" },
		{ category: "asian-series", title: "Asian Series" },
		{ category: "arabic-series", title: "Arabic Series" },
		{ category: "arabic-movies", title: "Arabic Movies" },
	];

	useEffect(() => {
		FileSystem.readAsStringAsync(
			FileSystem.documentDirectory + "trending-content.json"
		).then((data) => setData(JSON.parse(data)));
	}, []);

	if (data) {
		return (
			<ScrollView style={styles.parentStyle}>
				<FeaturedContentCardList />

				{listData.map(({ category, title }) => (
					<TrendingContentSection
						data={data[category]}
						title={title}
						category={category}
						navigation={navigation}
						key={category + title}
					/>
				))}
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
	parentStyle: {
		flex: 1,
	},
});

export default TrendingContentScreen;
