import React, { useState, useEffect, useRef } from "react";
import {
	View,
	StyleSheet,
	ActivityIndicator,
	Text,
	Dimensions,
} from "react-native";
import { TextInput } from "react-native-paper";
import { FontAwesome } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import ContentCardsList from "../components/ContentCardsList";
import RBSheet from "react-native-raw-bottom-sheet";

const SearchScreen = ({ navigation }) => {
	let jsonQuery = require("json-query");
	const [searchText, setSearchText] = useState("");
	const [allData, setAllData] = useState(null);
	const [featuredContent, setFeaturedContent] = useState(null);
	const bottomSheetRef = useRef(null);

	useEffect(() => {
		FileSystem.readAsStringAsync(
			FileSystem.documentDirectory + "all-content.json"
		).then((allData) => setAllData(JSON.parse(allData)));
		FileSystem.readAsStringAsync(
			FileSystem.documentDirectory + "featured-content.json"
		).then((featuredContent) =>
			setFeaturedContent(JSON.parse(featuredContent))
		);
	}, []);

	let data = jsonQuery(`content[*Title~/^.*${searchText}.*$/i]`, {
		data: allData,
		allowRegexp: true,
	}).value;

	if (searchText === "") {
		data = [];
	} else {
		// pass
	}

	if (allData && featuredContent) {
		return (
			<View style={{ flex: 1 }}>
				<View style={styles.searchBarParentStyle}>
					<TextInput
						placeholder="Search"
						mode="flat"
						style={styles.searchBarStyle}
						left={<TextInput.Icon icon="magnify" color="grey" />}
						underlineColor="transparent"
						activeUnderlineColor="transparent"
						cursorColor="black"
						onChangeText={(text) => setSearchText(text)}
					/>
					<FontAwesome
						name="sliders"
						size={27}
						color="red"
						style={styles.iconStyle}
						onPress={() => bottomSheetRef.current.open()}
					/>
				</View>
				<ContentCardsList
					data={searchText === "" ? Object.entries(featuredContent) : data}
					horizontal={false}
					formatted={searchText === "" ? false : true}
					width={180}
					height={270}
					navigation={navigation}
				/>
				<RBSheet
					ref={bottomSheetRef}
					closeOnDragDown={true}
					closeOnPressMask={true}
					height={500}
					customStyles={{
						wrapper: {
							backgroundColor: "rgba(0, 0, 0, 0.75)",
						},
						draggableIcon: {
							backgroundColor: "#ddd",
						},
						container: {
							borderRadius: 30,
						},
					}}
				>
					<View>
						<Text style={styles.filterTitleStyle}>Filter</Text>
						<View style={styles.separatorStyle} />
						<Text style={styles.filterSectionStyle}>Categories</Text>
						<Text style={styles.filterSectionStyle}>Genre</Text>
						<View style={styles.separatorStyle} />
					</View>
				</RBSheet>
			</View>
		);
	} else {
		<View style={styles.activityIndicatorParentStyle}>
			<ActivityIndicator size={50} />
		</View>;
	}
};

const styles = StyleSheet.create({
	searchBarStyle: {
		margin: 20,
		marginRight: 10,
		borderRadius: 10,
		borderTopRightRadius: 10,
		borderTopLeftRadius: 10,
		backgroundColor: "#eee",
		flex: 1,
	},
	iconStyle: {
		marginRight: 20,
		backgroundColor: "rgba(255, 0, 0, 0.1)",
		borderRadius: 15,
		padding: 15,
	},
	activityIndicatorParentStyle: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	parentStyle: {
		flex: 1,
	},
	searchBarParentStyle: {
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
	},
	filterTitleStyle: {
		fontSize: 26,
		fontWeight: "bold",
		color: "red",
		textAlign: "center",
		padding: 15,
		letterSpacing: 1.15,
	},
	separatorStyle: {
		borderBottomColor: "#ddd",
		borderBottomWidth: 3,
		flex: 1,
		width: Dimensions.get("window").width * 0.875,
		alignSelf: "center",
	},
	filterSectionStyle: {
		fontSize: 24,
		fontWeight: "bold",
		margin: 15,
	},
});

export default SearchScreen;
