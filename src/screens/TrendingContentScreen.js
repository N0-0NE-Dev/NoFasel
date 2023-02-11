import React, { useState, useEffect } from "react";
import { ScrollView } from "react-native";
import * as FileSystem from "expo-file-system";
import TrendingContentSection from "../components/TrendingContentSection";
import FeaturedContentCardList from "../components/FeaturedContentCardList";
import { useDeviceOrientation } from "@react-native-community/hooks";
import CentredActivityIndicator from "../components/CentredActivityIndicator";
import { isTablet } from "react-native-device-info";

const TrendingContentScreen = ({ navigation }) => {
	const [data, setData] = useState(null);
	const listData = require("../data/common.json").categories.slice(0, 5);
	const orientation = useDeviceOrientation();

	useEffect(() => {
		FileSystem.readAsStringAsync(
			FileSystem.documentDirectory + "trending-content.json"
		).then((data) => setData(JSON.parse(data)));
	}, []);

	if (data) {
		return (
			<ScrollView style={{ flex: 1 }}>
				{orientation == "portrait" && !isTablet() && (
					<FeaturedContentCardList navigation={navigation} />
				)}
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
		return <CentredActivityIndicator />;
	}
};

export default TrendingContentScreen;
