import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import ContentCardsList from "./ContentCardsList";
import { useTheme, Text } from "react-native-paper";

const TrendingContentSection = ({ data, title, category, navigation }) => {
	const dataEntries = Object.entries(data);
	const theme = useTheme();

	if (dataEntries.length > 0) {
		return (
			<View style={styles.sectionParentStyle}>
				<View style={styles.sectionHeaderStyle}>
					<Text style={styles.sectionTitleStyle}>{title}</Text>
					<Pressable
						style={styles.moreParentStyle}
						onPress={() =>
							navigation.navigate("All Content", { key: category })
						}
					>
						<Text style={{ fontSize: 15, color: theme.colors.primary }}>
							See all
						</Text>
					</Pressable>
				</View>

				<ContentCardsList
					data={dataEntries}
					navigation={navigation}
					horizontal={true}
					formatted={false}
					width={140}
					height={210}
				/>
			</View>
		);
	} else {
		// pass
	}
};

const styles = StyleSheet.create({
	moreParentStyle: {
		flexDirection: "row",
		alignSelf: "center",
		margin: 10,
		marginLeft: 5,
	},
	sectionParentStyle: {
		margin: 5,
		borderRadius: 10,
	},
	sectionHeaderStyle: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	sectionTitleStyle: {
		fontSize: 20,
		fontWeight: "bold",
		marginLeft: 15,
		marginVertical: 5,
	},
	moreTextStyle: {
		fontSize: 15,
	},
});

export default TrendingContentSection;
