import React, { useState, useEffect } from "react";
import { FlatList, Pressable, View, ToastAndroid } from "react-native";
import ContentCard from "./ContentCard";
import { Storage } from "./Storage";
import { useIsFocused } from "@react-navigation/native";
import { isTablet } from "react-native-device-info";
import { AntDesign } from "@expo/vector-icons";

if (!Storage.contains("watchlist")) {
	Storage.set("watchlist", JSON.stringify({}));
} else {
	// pass
}

const storedData = JSON.parse(Storage.getString("watchlist"));

const ContentCardsList = ({ navigation, data, horizontal, formatted, width, height }) => {
	const [refresh, setRefresh] = useState(false);
	const isFocused = useIsFocused();

	useEffect(() => setRefresh(!refresh), [isFocused]);

	const AddToWatchlistButton = ({ id, category, imageSource, title }) => {
		const showToast = (message) => {
			ToastAndroid.show(message, ToastAndroid.SHORT);
		};

		const handlePress = () => {
			if (storedData.hasOwnProperty(id)) {
				delete storedData[id];
				showToast("Removed from watchlist");
			} else {
				Object.assign(storedData, {
					[id]: {
						Category: category,
						"Image Source": imageSource,
						Title: title,
					},
				});
				showToast("Added to watchlist");
			}

			Storage.set("watchlist", JSON.stringify(storedData));
			setRefresh(!refresh);
		};

		return (
			<Pressable
				style={{ position: "absolute", zIndex: 1, padding: 2.5 }}
				onPress={handlePress}
			>
				{storedData.hasOwnProperty(id) ? (
					<AntDesign name="star" size={30} color="gold" />
				) : (
					<AntDesign name="staro" size={30} color="gold" />
				)}
			</Pressable>
		);
	};

	let numColumns = null;

	if (horizontal) {
		numColumns = 1;
	} else if (!horizontal && isTablet()) {
		numColumns = 4;
	} else {
		numColumns = 2;
	}

	return (
		<FlatList
			data={data}
			showsHorizontalScrollIndicator={false}
			contentContainerStyle={{ alignItems: "center" }}
			horizontal={horizontal}
			numColumns={numColumns}
			nestedScrollEnabled={true}
			renderItem={({ item }) => {
				const id = formatted ? item["key"] : item[0];
				const category = formatted ? item["Category"] : item[1]["Category"];
				const imageSource = formatted
					? item["Image Source"]
					: item[1]["Image Source"];
				const title = formatted ? item["Title"] : item[1]["Title"];

				return (
					<ContentCard
						imageSource={imageSource}
						title={title}
						id={id}
						navigation={navigation}
						category={category}
						width={width}
						height={height}
					/>
				);
			}}
			keyExtractor={(item) => {
				return formatted ? item["key"] : item[0];
			}}
		/>
	);
};

export default ContentCardsList;
