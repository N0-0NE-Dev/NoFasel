import React, { useEffect, useState } from "react";
import { View, TextInput, StyleSheet, ActivityIndicator } from "react-native";
import ContentCardsList from "../components/ContentCardsList";
import * as FileSystem from "expo-file-system";
import { StatusBar } from "expo-status-bar";

const SearchScreen = ({ navigation }) => {
	let jsonQuery = require("json-query");
	const [searchTerm, setSearchTerm] = useState();
	const [allData, setAllData] = useState();

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

	if (allData) {
		return (
			<View style={styles.parentStyle}>
				<StatusBar style="dark" />
				<TextInput
					style={styles.textInputStyle}
					placeholder="Search"
					onChangeText={setSearchTerm}
					placeholderTextColor="#BEBEBE"
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
				<StatusBar style="dark" />
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
		color: "black",
	},
	parentStyle: {
		flex: 1,
	},
});

export default SearchScreen;
