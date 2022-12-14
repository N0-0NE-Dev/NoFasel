import React, { useEffect, useState } from "react";
import { View, TextInput, StyleSheet, ActivityIndicator } from "react-native";
import ContentCardsList from "../components/ContentCardsList";
import * as FileSystem from "expo-file-system";
import ModalSelector from "react-native-modal-selector";
import { Storage } from "../components/Storage";

const darkTheme = Storage.getBoolean("darkTheme");

const SearchScreen = ({ navigation }) => {
	let jsonQuery = require("json-query");
	const [searchTerm, setSearchTerm] = useState();
	const [allData, setAllData] = useState();
	const [filter, setFilter] = useState("all");

	const selectorData = [
		{ label: "All", key: "all" },
		{ label: "Movies", key: "movies" },
		{ label: "Series", key: "series" },
		{ label: "Anime", key: "anime" },
		{ label: "Asian Series", key: "asian-series" },
		{ label: "TV Shows", key: "tvshows" },
		{ label: "Arabic Series", key: "arabic-series" },
	];

	useEffect(() => {
		FileSystem.readAsStringAsync(
			FileSystem.documentDirectory + "all-content.json"
		).then((data) => setAllData(JSON.parse(data)));
	}, []);

	let data = jsonQuery(`content[*Title~/^.*${searchTerm}.*$/i]`, {
		data: allData,
		allowRegexp: true,
	}).value;

	if (searchTerm === "") {
		data = [];
	} else {
		// pass
	}

	if (data !== null && filter != "all") {
		data = data.filter((element) => element["Category"] == filter);
	} else {
		// pass
	}

	if (allData) {
		return (
			<View style={styles.parentStyle}>
				<TextInput
					style={styles.textInputStyle}
					placeholder="Search"
					onChangeText={setSearchTerm}
					placeholderTextColor="#BEBEBE"
					autoFocus={true}
				/>
				<ModalSelector
					data={selectorData}
					onChange={(option) => setFilter(option.key)}
					style={styles.modalSelectorStyle}
					backdropPressToClose={true}
					selectedKey={filter}
					selectTextStyle={{ color: darkTheme ? "white" : "black" }}
					optionContainerStyle={{
						backgroundColor: darkTheme ? "black" : "white",
						borderColor: darkTheme ? "white" : "black",
						borderWidth: 1,
					}}
					optionTextStyle={{ color: darkTheme ? "#add8e6" : "blue" }}
					cancelText="Cancel"
					cancelStyle={{
						backgroundColor: darkTheme ? "black" : "white",
						borderWidth: 1,
						borderColor: darkTheme ? "white" : "black",
					}}
					cancelTextStyle={{ color: darkTheme ? "white" : "black" }}
				/>
				<ContentCardsList
					navigation={navigation}
					data={data}
					horizontal={false}
					formatted={true}
				/>
			</View>
		);
	} else {
		return (
			<View>
				<ActivityIndicator size={50} />
			</View>
		);
	}
};

const styles = StyleSheet.create({
	textInputStyle: {
		borderWidth: 1,
		padding: 10,
		textAlign: "center",
		margin: 10,
		color: darkTheme ? "white" : "black",
		borderColor: darkTheme ? "white" : "black",
	},
	parentStyle: {
		flex: 1,
	},
	modalSelectorStyle: {
		borderColor: darkTheme ? "white" : "black",
		borderWidth: 1,
		width: 250,
		alignSelf: "center",
		borderRadius: 5,
		marginBottom: 5,
	},
});

export default SearchScreen;
