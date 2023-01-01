import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { Octicons, Feather, AntDesign } from "@expo/vector-icons";
import { Storage } from "./Storage";

const darkTheme = Storage.getBoolean("darkTheme");

export function TrendingTitleComponent() {
	return (
		<View style={styles.parentStyle}>
			<Octicons
				name="flame"
				size={20}
				color="orange"
				style={styles.iconStyle}
			/>
			<Text style={styles.textStyle}>Trending</Text>
		</View>
	);
}

export function WatchlistTitleComponent() {
	return (
		<View style={styles.parentStyle}>
			<Feather
				name="list"
				size={20}
				color={darkTheme ? "white" : "black"}
				style={styles.iconStyle}
			/>
			<Text style={styles.textStyle}>Watchlist</Text>
		</View>
	);
}

export function SettingsTitleComponent() {
	return (
		<View style={styles.parentStyle}>
			<AntDesign
				name="setting"
				size={20}
				color={darkTheme ? "white" : "black"}
				style={styles.iconStyle}
			/>
			<Text style={styles.textStyle}>Settings</Text>
		</View>
	);
}

export function AllContentTitleComponent() {
	return (
		<View style={styles.parentStyle}>
			<Feather
				name="film"
				size={20}
				color={darkTheme ? "white" : "black"}
				style={styles.iconStyle}
			/>
			<Text style={styles.textStyle}>All Content</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	textStyle: {
		fontSize: 15,
		fontWeight: "bold",
		color: darkTheme ? "white" : "black",
	},
	parentStyle: {
		flexDirection: "row",
	},
	iconStyle: {
		marginRight: 10,
		marginTop: 2,
	},
});
