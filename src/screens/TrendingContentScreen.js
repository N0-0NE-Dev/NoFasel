import React, { useState, useEffect } from "react";
import { StyleSheet, ActivityIndicator, View, ScrollView } from "react-native";
import * as FileSystem from "expo-file-system";
import TrendingContentSection from "../components/TrendingContentSection";
import FeaturedContentCardList from "../components/FeaturedContentCardList";

const TrendingContentScreen = ({ navigation }) => {
	const [data, setData] = useState(null);
	const listData = require("../data/common.json").categories.slice(0, 5);

	useEffect(() => {
		FileSystem.readAsStringAsync(
			FileSystem.documentDirectory + "trending-content.json"
		).then((data) => setData(JSON.parse(data)));
	}, []);

	if (data) {
		return (
			<ScrollView style={styles.parentStyle}>
				<FeaturedContentCardList />

				{listData.map(({ label, key }) => (
					<TrendingContentSection
						data={data[key]}
						title={label}
						category={key}
						navigation={navigation}
						key={label + key}
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
