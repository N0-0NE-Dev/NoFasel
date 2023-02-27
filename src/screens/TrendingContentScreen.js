import React, { useState, useEffect } from "react";
import { ScrollView } from "react-native";
import * as FileSystem from "expo-file-system";
import TrendingContentSection from "../components/TrendingContentSection";
import FeaturedContentCardList from "../components/FeaturedContentCardList";
import { useDeviceOrientation } from "@react-native-community/hooks";
import CentredActivityIndicator from "../components/CentredActivityIndicator";
import { isTablet } from "react-native-device-info";
import { Storage } from "../components/Storage";

const TrendingContentScreen = ({ navigation }) => {
	const [data, setData] = useState(null);
	const common = require("../data/common.json");
	const orientation = useDeviceOrientation();
	const provider = Storage.getString("provider");
	let filePath = "";

	const listData =
		provider == "fasel"
			? common.categoriesFasel.slice(0, 5)
			: common.categoriesHdw;

	if (provider == "fasel") {
		filePath = FileSystem.documentDirectory + "trending-content.json";
	} else {
		filePath = FileSystem.documentDirectory + "hdw-trending-content.json";
	}

	useEffect(() => {
		FileSystem.readAsStringAsync(filePath).then((data) =>
			setData(JSON.parse(data))
		);
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
