import React from "react";
import { View, StyleSheet, Pressable, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Storage } from "./Storage";

const darkTheme = Storage.getBoolean("darkTheme");

const NextButton = ({ handleNext, pageNumber, lastPageNumber }) => {
	return (
		<Pressable style={styles.navigationButtonStyle} onPress={handleNext}>
			<Text
				style={{
					color:
						pageNumber == lastPageNumber
							? "grey"
							: darkTheme
							? "#add8e6"
							: "blue",
					fontSize: 16,
				}}
			>
				Next
			</Text>
			<MaterialIcons
				name="navigate-next"
				size={25}
				color={
					pageNumber == lastPageNumber ? "grey" : darkTheme ? "#add8e6" : "blue"
				}
			/>
		</Pressable>
	);
};

const PreviousButton = ({ handlePrevious, pageNumber }) => {
	return (
		<Pressable style={styles.navigationButtonStyle} onPress={handlePrevious}>
			<MaterialIcons
				name="navigate-before"
				size={25}
				color={pageNumber == 1 ? "grey" : darkTheme ? "#add8e6" : "blue"}
			/>
			<Text
				style={{
					color: pageNumber == 1 ? "grey" : darkTheme ? "#add8e6" : "blue",
					fontSize: 16,
				}}
			>
				Previous
			</Text>
		</Pressable>
	);
};

const PageNumberButton = ({ pageNumber, handleModal, lastPageNumber }) => {
	return (
		<Pressable onPress={handleModal}>
			<Text style={styles.pageNumberStyle}>
				{pageNumber} of {lastPageNumber}
			</Text>
		</Pressable>
	);
};

const Footer = ({
	handlePrevious,
	pageNumber,
	handleNext,
	handleModal,
	lastPageNumber,
}) => {
	return (
		<View style={styles.footerStyle}>
			<PreviousButton handlePrevious={handlePrevious} pageNumber={pageNumber} />
			<PageNumberButton
				pageNumber={pageNumber}
				handleModal={handleModal}
				lastPageNumber={lastPageNumber}
			/>
			<NextButton
				handleNext={handleNext}
				pageNumber={pageNumber}
				lastPageNumber={lastPageNumber}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	footerStyle: {
		flexDirection: "row",
		justifyContent: "center",
	},
	pageNumberStyle: {
		padding: 5,
		margin: 10,
	},
	navigationButtonStyle: {
		flexDirection: "row",
		alignSelf: "center",
		padding: 5,
	},
	pageNumberStyle: {
		padding: 5,
		margin: 10,
		color: darkTheme ? "#add8e6" : "blue",
		fontSize: 16,
	},
});

export default Footer;
