import React, { useState, useEffect, useRef } from "react";
import FeaturedContentCard from "./FeaturedContentCard";
import * as FileSystem from "expo-file-system";
import { Dimensions, ScrollView } from "react-native";

const WINDOW_WIDTH = Dimensions.get("window").width;

const FeaturedContentCardList = () => {
	const [data, setData] = useState();
	const [currentPosition, setCurrentPosition] = useState(0);
	const scrollViewRef = useRef();

	useEffect(() => {
		FileSystem.readAsStringAsync(
			FileSystem.documentDirectory + "featured-content.json"
		).then((data) => setData(JSON.parse(data)));
	}, []);

	useEffect(() => {
		if (data && scrollViewRef) {
			const timeout = setTimeout(() => {
				scrollViewRef.current.scrollTo({
					x: WINDOW_WIDTH * currentPosition,
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
					/>
				))}
			</ScrollView>
		);
	} else {
		// pass
	}
};

export default FeaturedContentCardList;
