import React, { useState, useEffect } from "react";
import { ScrollView } from "react-native";
import TrendingContentSection from "../components/TrendingContentSection";
import FeaturedContentCardList from "../components/FeaturedContentCardList";
import { useDeviceOrientation } from "@react-native-community/hooks";
import CentredActivityIndicator from "../components/CentredActivityIndicator";
import { isTablet } from "react-native-device-info";
import ReactNativeBlobUtil from "react-native-blob-util";

const TrendingContentScreen = ({ navigation }) => {
	const [data, setData] = useState(null);
	const common = require("../data/common.json");
	const orientation = useDeviceOrientation();
	let filePath =
		ReactNativeBlobUtil.fs.dirs.DocumentDir + "/trending-content.json";

	const listData = common.categoriesFasel.slice(0, 5);

	useEffect(() => {
		ReactNativeBlobUtil.fs
			.readFile(filePath)
			.then(data => setData(JSON.parse(data)));
	}, []);

	if (data) {
		return (
			<ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
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
