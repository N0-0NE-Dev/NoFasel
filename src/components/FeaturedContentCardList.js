import React, { useState, useEffect, useRef } from "react";
import FeaturedContentCard from "./FeaturedContentCard";
import * as FileSystem from "expo-file-system";
import { Dimensions, ScrollView } from "react-native";

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
			const interval = setInterval(() => {
				scrollViewRef.current.scrollTo({
					x: Dimensions.get("window").width * currentPosition,
					y: 0,
					animated: true,
				});

				if (currentPosition == Object.entries(data).length - 1) {
					setCurrentPosition(0);
				} else {
					setCurrentPosition(currentPosition + 1);
				}
			}, 3000);
			return () => {
				clearInterval(interval);
			};
		}
	}, [data, currentPosition, scrollViewRef]);

	if (data) {
		return (
			<ScrollView horizontal={true} ref={scrollViewRef}>
				{Object.entries(data).map((item) => (
					<FeaturedContentCard
						title={item[1]["Title"]}
						imageSource={item[1]["Image Source"]}
						key={item[0]}
					/>
				))}
			</ScrollView>
		);
	} else {
		// pass
	}
};

export default FeaturedContentCardList;
