import React from "react";
import { View, StyleSheet } from "react-native";
import { Storage } from "../components/Storage";
import { Text, Button } from "react-native-paper";

const StartupScreen = ({ navigation }) => {
	const handleProvider = provider => {
		Storage.set("provider", provider);
		navigation.navigate("Loading");
	};

	return (
		<View
			style={{
				flex: 1,
				alignItems: "center",
				margin: 20,
				justifyContent: "center",
			}}>
			<Text
				style={{
					fontSize: 20,
					fontWeight: "bold",
					marginHorizontal: 10,
					marginBottom: 10,
				}}>
				Select Content Provider
			</Text>
			<Button
				mode="outlined"
				style={styles.buttonStyle}
				labelStyle={styles.buttonLabelStyle}
				onPress={() => handleProvider("fasel")}>
				FaselHD
			</Button>
			<Button
				mode="outlined"
				style={styles.buttonStyle}
				labelStyle={styles.buttonLabelStyle}
				onPress={() => handleProvider("hdw")}>
				HDwatched
			</Button>
		</View>
	);
};

const styles = StyleSheet.create({
	buttonStyle: {
		marginTop: 10,
		borderWidth: 0,
	},
	buttonLabelStyle: {
		fontSize: 18,
		padding: 10,
	},
});

export default StartupScreen;
