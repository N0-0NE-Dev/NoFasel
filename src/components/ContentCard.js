import React from "react";
import { Pressable, StyleSheet, ImageBackground } from "react-native";
import { Text, useTheme } from "react-native-paper";

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
	const theme = useTheme();

	return (
		<Pressable
			style={{ width: width, margin: 5 }}
			onPress={() =>
				navigation.navigate(
					category == "WeCima" ? "WeCima Extraction" : "Select",
					{ id: id, category: category },
				)
			}>
			<ImageBackground
				style={{ width: width, height: height }}
				imageStyle={{ borderRadius: 15 }}
				source={{ uri: imageSource }}>
				<Text
					style={{
						...styles.ratingTextStyle,
						backgroundColor: theme.colors.primary,
					}}>
					{rating ? rating : "N/A"}
				</Text>
			</ImageBackground>
			<Text numberOfLines={1} style={styles.titleStyle}>
				{title}
			</Text>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	ratingTextStyle: {
		width: 40,
		margin: 3,
		padding: 5,
		textAlign: "center",
		fontSize: 12,
		borderRadius: 10,
		color: "black",
		fontWeight: "bold",
	},
	titleStyle: {
		textAlign: "center",
		fontSize: 14,
		marginVertical: 3,
	},
});

export default ContentCard;
