import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import ContentCardsList from "../components/ContentCardsList";
import { Storage } from "../components/Storage";
import { useIsFocused } from "@react-navigation/native";

const WatchlistScreen = ({ navigation }) => {
	const [refresh, setRefresh] = useState(false);
	const storedData = JSON.parse(Storage.getString("watchlist"));
	const isFocused = useIsFocused();

	useEffect(() => setRefresh(!refresh), [isFocused]);

	return (
		<View style={styles.parentStyle}>
			<View style={styles.listParentStyle}>
				<ContentCardsList
					navigation={navigation}
					data={Object.entries(storedData)}
					horizontal={false}
				/>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	listParentStyle: {
		marginTop: 10,
	},
	parentStyle: {
		flex: 1,
	},
});

export default WatchlistScreen;
