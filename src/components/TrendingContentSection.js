import React from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";
import ContentCardsList from "./ContentCardsList";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Storage } from "../components/Storage";

const darkTheme = Storage.getBoolean("darkTheme");

const TrendingContentSection = ({ data, title, category, navigation }) => {
	const dataEntries = Object.entries(data);

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
						<Text style={styles.moreTextStyle}>More</Text>
						<MaterialCommunityIcons
							name="chevron-double-right"
							size={24}
							color={darkTheme ? "#add8e6" : "blue"}
						/>
					</Pressable>
				</View>

				<ContentCardsList
					data={dataEntries}
					navigation={navigation}
					horizontal={true}
					formatted={false}
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
	},
	sectionParentStyle: {
		backgroundColor: darkTheme ? "black" : "white",
		margin: 5,
		borderRadius: 10,
	},
	sectionHeaderStyle: {
		flexDirection: "row",
		justifyContent: "space-between",
		borderBottomColor: darkTheme ? "#18191a" : "#eee",
		borderBottomWidth: 2,
	},
	sectionTitleStyle: {
		fontSize: 20,
		fontWeight: "bold",
		marginLeft: 10,
		marginVertical: 5,
		color: darkTheme ? "white" : "black",
	},
	moreTextStyle: {
		fontSize: 15,
		color: darkTheme ? "#add8e6" : "blue",
	},
});

export default TrendingContentSection;
