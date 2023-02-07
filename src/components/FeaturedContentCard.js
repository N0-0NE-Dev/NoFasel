import React from "react";
import { View, StyleSheet, Dimensions, ImageBackground } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { Button, useTheme, Text } from "react-native-paper";

const FeaturedContentCard = ({
	navigation,
	title,
	imageSource,
	genres,
	category,
	id,
}) => {
	const theme = useTheme();

	return (
		<ImageBackground source={{ uri: imageSource }} style={styles.imageStyle}>
			<LinearGradient
				colors={["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 1)"]}
				style={{ flex: 1, justifyContent: "flex-end" }}
			>
				<Text numberOfLines={1} style={styles.titleStyle}>
					{title}
				</Text>

				<View style={styles.genresParentStyle}>
					{genres.map((genre) => (
						<Text key={genre} style={styles.genreTextStyle}>
							{genre}
						</Text>
					))}
				</View>

				<View style={styles.buttonsParentStyle}>
					<Button
						mode="contained"
						icon="play-circle"
						style={styles.buttonStyle}
						labelStyle={{ fontSize: 18 }}
						onPress={() =>
							navigation.navigate("Select", {
								category: category,
								id: id,
							})
						}
					>
						Play
					</Button>

					<Button
						icon="plus"
						mode="outlined"
						style={{
							...styles.buttonStyle,
							borderColor: theme.colors.primary,
							borderWidth: 2,
						}}
						labelStyle={{ fontSize: 18 }}
					>
						My List
					</Button>
				</View>
			</LinearGradient>
		</ImageBackground>
	);
};

const styles = StyleSheet.create({
	imageStyle: {
		width: Dimensions.get("window").width,
		height: Dimensions.get("window").height * 0.4,
	},
	titleStyle: {
		marginLeft: 20,
		marginBottom: 10,
		fontSize: 24,
		fontWeight: "bold",
		letterSpacing: 1.25,
		backgroundColor: "transparent",
	},
	buttonsParentStyle: {
		flexDirection: "row",
		backgroundColor: "transparent",
	},
	genresParentStyle: {
		flexDirection: "row",
		marginLeft: 20,
		marginBottom: 20,
	},
	genreTextStyle: {
		marginRight: 10,
		fontSize: 16,
		fontWeight: "250",
	},
	buttonStyle: {
		marginLeft: 10,
		marginBottom: 20,
	},
});

export default FeaturedContentCard;
