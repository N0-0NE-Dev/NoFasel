import React from "react";
import { FlatList } from "react-native";
import ContentCard from "./ContentCard";
import { isTablet } from "react-native-device-info";
import { useTheme } from "react-native-paper";

const ContentCardsList = ({
	navigation,
	data,
	horizontal,
	formatted,
	width,
	height,
}) => {
	const theme = useTheme();

	let numColumns = null;

	if (horizontal) {
		numColumns = 1;
	} else if (!horizontal && isTablet()) {
		numColumns = 3;
	} else {
		numColumns = 2;
	}

	return (
		<FlatList
			data={data}
			showsHorizontalScrollIndicator={false}
			contentContainerStyle={{
				alignItems: "center",
				backgroundColor: theme.colors.background,
			}}
			horizontal={horizontal}
			numColumns={numColumns}
			nestedScrollEnabled={true}
			renderItem={({ item }) => {
				const id = formatted ? item["key"] : item[0];
				const category = formatted ? item["Category"] : item[1]["Category"];
				const title = formatted ? item["Title"] : item[1]["Title"];
				const rating = formatted ? item["Rating"] : item[1]["Rating"];
				const imageSource = formatted
					? item["Image Source"]
					: item[1]["Image Source"];

				return (
					<ContentCard
						imageSource={imageSource}
						title={title}
						id={id}
						navigation={navigation}
						category={category}
						width={width}
						height={height}
						rating={rating}
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
