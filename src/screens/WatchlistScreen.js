import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image } from "react-native";
import ContentCardsList from "../components/ContentCardsList";
import { Storage } from "../components/Storage";
import { useIsFocused } from "@react-navigation/native";
import { Text, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const WatchlistScreen = ({ navigation }) => {
	const [refresh, setRefresh] = useState(false);
	const storedData = JSON.parse(Storage.getString("watchlist"));
	const isFocused = useIsFocused();
	const theme = useTheme();

	useEffect(() => setRefresh(!refresh), [isFocused]);

	if (Object.entries(storedData).length !== 0) {
		return (
			<SafeAreaView style={{ flex: 1 }}>
				<View style={{ marginTop: 10 }}>
					<ContentCardsList
						navigation={navigation}
						data={Object.entries(storedData)}
						horizontal={false}
						width={180}
						height={270}
					/>
				</View>
			</SafeAreaView>
		);
	} else {
		return (
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<Image
					source={require("../assets/EmptyList.png")}
					style={{ width: 648 * 0.5, height: 632 * 0.5 }}
				/>
				<Text
					style={{ ...styles.emptyListTextStyle, color: theme.colors.primary }}
				>
					Your List is Empty
				</Text>
				<Text style={styles.descriptionTextStyle}>
					It seems like you haven't added any content to the list.
				</Text>
			</View>
		);
	}
};

const styles = StyleSheet.create({
	emptyListTextStyle: {
		fontWeight: "bold",
		fontSize: 26,
		margin: 20,
	},
	descriptionTextStyle: {
		textAlign: "center",
		marginHorizontal: 10,
		fontSize: 16,
		letterSpacing: 0.75,
	},
});

export default WatchlistScreen;
