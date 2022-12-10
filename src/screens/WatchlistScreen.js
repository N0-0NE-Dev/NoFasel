import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import ContentCardsList from "../components/ContentCardsList";
import { Storage } from "../components/Storage";
import { useIsFocused } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";

const WatchlistScreen = ({ navigation }) => {
	const [refresh, setRefresh] = useState(false);
	const storedData = JSON.parse(Storage.getString("watchlist"));
	const isFocused = useIsFocused();

	useEffect(() => setRefresh(!refresh), [isFocused]);

	return (
		<View style={styles.parentStyle}>
			<StatusBar style="dark" />
			<ContentCardsList
				navigation={navigation}
				data={Object.entries(storedData)}
				horizontal={false}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	parentStyle: {
		marginTop: 10,
	},
});

export default WatchlistScreen;
