import React from "react";
import { Pressable, StyleSheet, Text, ImageBackground } from "react-native";
import { Storage } from "./Storage";

const darkTheme = Storage.getBoolean("darkTheme");

const ContentCard = ({
	navigation,
	imageSource,
	id,
	category,
	width,
	height,
	rating,
	title,
}) => {
	const styles = StyleSheet.create({
		patentStyle: {
			width: width,
			margin: 5,
		},
		imageBackgroundStyle: {
			width: width,
			height: height,
		},
		ratingTextStyle: {
			backgroundColor: "red",
			width: 40,
			margin: 5,
			color: "white",
			padding: 5,
			textAlign: "center",
			fontSize: 12,
			borderRadius: 10,
		},
		imageStyle: {
			borderRadius: 15,
		},
		titleStyle: {
			textAlign: "center",
			fontSize: 14,
			marginVertical: 3,
		},
	});

	return (
		<Pressable
			style={styles.patentStyle}
			onPress={() =>
				navigation.navigate("Select", { id: id, category: category })
			}
		>
			<ImageBackground
				style={styles.imageBackgroundStyle}
				imageStyle={styles.imageStyle}
				source={{ uri: imageSource }}
			>
				<Text style={styles.ratingTextStyle}>{rating ? rating : "N/A"}</Text>
			</ImageBackground>
			<Text numberOfLines={1} style={styles.titleStyle}>
				{title}
			</Text>
		</Pressable>
	);
};

export default ContentCard;
