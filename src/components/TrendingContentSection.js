import React from "react";
import { View, StyleSheet } from "react-native";
import ContentCardsList from "./ContentCardsList";
import { Text } from "react-native-paper";

const TrendingContentSection = ({ data, title, navigation }) => {
	const dataEntries = Object.entries(data);
	if (dataEntries.length > 0) {
		return (
			<View style={styles.sectionParentStyle}>
				<View style={styles.sectionHeaderStyle}>
					<Text style={styles.sectionTitleStyle}>{title}</Text>
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
