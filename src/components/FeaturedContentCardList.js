import React, { useState, useEffect, useRef } from "react";
import FeaturedContentCard from "./FeaturedContentCard";
import * as FileSystem from "expo-file-system";
import { Dimensions, ScrollView } from "react-native";
import { Storage } from "./Storage";

const FeaturedContentCardList = ({ navigation }) => {
	const [data, setData] = useState();
	const [currentPosition, setCurrentPosition] = useState(0);
	const scrollViewRef = useRef();
	let filePath = "";

	if (Storage.getString("provider") == "fasel") {
		filePath = FileSystem.documentDirectory + "featured-content.json";
	} else {
		filePath = FileSystem.documentDirectory + "hdw-featured-content.json";
	}

	useEffect(() => {
		FileSystem.readAsStringAsync(filePath).then((data) =>
			setData(JSON.parse(data))
		);
	}, []);

	useEffect(() => {
		if (data && scrollViewRef) {
			const timeout = setTimeout(() => {
				scrollViewRef.current.scrollTo({
					x: Dimensions.get("window").width * currentPosition,
					y: 0,
					animated: true,
				});

				if (currentPosition == data.content.length - 1) {
					setCurrentPosition(0);
				} else {
					setCurrentPosition(currentPosition + 1);
				}
			}, 2500);
			return () => {
				clearTimeout(timeout);
			};
		}
	}, [data, currentPosition, scrollViewRef]);

	if (data) {
		return (
			<ScrollView horizontal={true} ref={scrollViewRef} scrollEnabled={false}>
				{data.content.map((item) => (
					<FeaturedContentCard
						title={item["Title"]}
						imageSource={item["Image Source"]}
						key={item["key"]}
						genres={item["Genres"]}
						category={item["Category"]}
						id={item["key"]}
						navigation={navigation}
						rating={item["Rating"] ? item["Rating"] : "N/A"}
					/>
				))}
			</ScrollView>
		);
	} else {
		// pass
	}
};

export default FeaturedContentCardList;
