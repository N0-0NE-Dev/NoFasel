import React, { useState, useEffect } from "react";
import {
	ScrollView,
	StyleSheet,
	Text,
	ActivityIndicator,
	View,
	Pressable,
} from "react-native";
import ContentCardsList from "../components/ContentCardsList";
import * as FileSystem from "expo-file-system";
import { Storage } from "../components/Storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const darkTheme = Storage.getBoolean("darkTheme");

const TrendingContentScreen = ({ navigation }) => {
	const [data, setData] = useState(null);

	useEffect(() => {
		FileSystem.readAsStringAsync(
			FileSystem.documentDirectory + "trending-content.json"
		).then((data) => setData(JSON.parse(data)));
	}, []);

	const More = ({ category }) => {
		return (
			<Pressable
				style={styles.moreParentStyle}
				onPress={() => navigation.navigate("All Content", { key: category })}
			>
				<Text style={styles.moreStyle}>More</Text>
				<MaterialCommunityIcons
					name="chevron-double-right"
					size={24}
					color={darkTheme ? "#add8e6" : "blue"}
				/>
			</Pressable>
		);
	};

	if (data) {
		return (
			<ScrollView>
				<View style={styles.sectionParentStyle}>
					<View style={styles.sectionHeaderStyle}>
						<Text style={styles.sectionTitleStyle}>Movies</Text>
						<More category="movies" />
					</View>
					<ContentCardsList
						data={Object.entries(data.movies)}
						navigation={navigation}
						horizontal={true}
						formatted={false}
					/>
				</View>

				<View style={styles.sectionParentStyle}>
					<View style={styles.sectionHeaderStyle}>
						<Text style={styles.sectionTitleStyle}>Series</Text>
						<More category="series" />
					</View>
					<ContentCardsList
						data={Object.entries(data.series)}
						navigation={navigation}
						horizontal={true}
						formatted={false}
					/>
				</View>

				<View style={styles.sectionParentStyle}>
					<View style={styles.sectionHeaderStyle}>
						<Text style={styles.sectionTitleStyle}>Anime</Text>
						<More category="anime" />
					</View>
					<ContentCardsList
						data={Object.entries(data.anime)}
						navigation={navigation}
						horizontal={true}
						formatted={false}
					/>
				</View>

				<View style={styles.sectionParentStyle}>
					<View style={styles.sectionHeaderStyle}>
						<Text style={styles.sectionTitleStyle}>Asian Series</Text>
						<More category="asian-series" />
					</View>
					<ContentCardsList
						data={Object.entries(data["asian-series"])}
						navigation={navigation}
						horizontal={true}
						formatted={false}
					/>
				</View>

				<View style={styles.sectionParentStyle}>
					{Object.entries(data["arabic-series"]).length > 0 && (
						<View style={styles.sectionHeaderStyle}>
							<Text style={styles.sectionTitleStyle}>Arabic Series</Text>
							<More category="arabic-series" />
						</View>
					)}

					<ContentCardsList
						data={Object.entries(data["arabic-series"])}
						navigation={navigation}
						horizontal={true}
						formatted={false}
					/>
				</View>

				<View style={styles.sectionParentStyle}>
					{Object.entries(data["arabic-movies"]).length > 0 && (
						<View style={styles.sectionHeaderStyle}>
							<Text style={styles.sectionTitleStyle}>Arabic Movies</Text>
							<More category="arabic-movies" />
						</View>
					)}

					<ContentCardsList
						data={Object.entries(data["arabic-movies"])}
						navigation={navigation}
						horizontal={true}
						formatted={false}
					/>
				</View>
			</ScrollView>
		);
	} else {
		return (
			<View style={styles.indicatorParentStyle}>
				<ActivityIndicator size={50} />
			</View>
		);
	}
};

const styles = StyleSheet.create({
	sectionTitleStyle: {
		fontSize: 20,
		fontWeight: "bold",
		marginLeft: 10,
		marginVertical: 5,
		color: darkTheme ? "white" : "black",
	},
	indicatorParentStyle: {
		flex: 1,
		justifyContent: "center",
	},
	sectionParentStyle: {
		backgroundColor: darkTheme ? "black" : "white",
		margin: 5,
		borderRadius: 10,
	},
	moreStyle: {
		fontSize: 15,
		color: darkTheme ? "#add8e6" : "blue",
	},
	sectionHeaderStyle: {
		flexDirection: "row",
		justifyContent: "space-between",
		borderBottomColor: "#18191a",
		borderBottomWidth: 2,
	},
	moreParentStyle: {
		flexDirection: "row",
		alignSelf: "center",
		margin: 10,
	},
});

export default TrendingContentScreen;
