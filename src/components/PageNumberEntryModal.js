import React from "react";
import {
	Modal,
	TextInput,
	View,
	StyleSheet,
	Pressable,
	Text,
	Button,
} from "react-native";
import { Storage } from "./Storage";

const darkTheme = Storage.getBoolean("darkTheme");

const ModalButtons = ({ handleCancellation, handleSubmission }) => {
	return (
		<View style={styles.modalButtonsParentStyle}>
			<View style={styles.modalButtonStyle}>
				<Button title="Cancel" onPress={handleCancellation} />
			</View>
			<View style={styles.modalButtonStyle}>
				<Button title="Go" onPress={handleSubmission} />
			</View>
		</View>
	);
};

const PageNumberEntryModal = ({
	modalVisible,
	setPageNumberInput,
	pageNumberInput,
	handleSubmission,
	handleCancellation,
	lastPageNumber,
}) => {
	return (
		<Modal
			animationType="slide"
			transparent={true}
			visible={modalVisible}
			statusBarTranslucent={true}
		>
			<Pressable
				style={styles.modalBackgroundStyle}
				onPress={handleCancellation}
			>
				<View style={styles.modalViewStyle}>
					{(pageNumberInput > lastPageNumber ||
						(pageNumberInput < 1 && pageNumberInput !== "")) && (
						<Text
							style={styles.warningTextStyle}
						>{`Please enter a number between 1 and ${lastPageNumber}`}</Text>
					)}
					<TextInput
						onChangeText={setPageNumberInput}
						value={pageNumberInput}
						keyboardType="numeric"
						placeholder="Enter Page Number"
						onSubmitEditing={handleSubmission}
						style={styles.textInputStyle}
						placeholderTextColor="#BEBEBE"
					/>
					<ModalButtons
						handleCancellation={handleCancellation}
						handleSubmission={handleSubmission}
					/>
				</View>
			</Pressable>
		</Modal>
	);
};

const styles = StyleSheet.create({
	modalBackgroundStyle: {
		backgroundColor: "rgba(0,0,0,0.5)",
		position: "absolute",
		...StyleSheet.absoluteFillObject,
		justifyContent: "center",
		alignItems: "center",
	},
	modalViewStyle: {
		margin: 20,
		backgroundColor: darkTheme ? "black" : "white",
		borderRadius: 20,
		padding: 35,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	textInputStyle: {
		margin: 10,
		textAlign: "center",
		color: darkTheme ? "white" : "black",
		paddingVertical: 10,
		paddingHorizontal: 50,
	},
	buttonParentStyle: {
		width: 100,
	},
	warningTextStyle: {
		color: "red",
	},
	modalButtonsParentStyle: {
		flexDirection: "row",
	},
	modalButtonStyle: {
		width: 100,
		margin: 10,
	},
});

export default PageNumberEntryModal;
