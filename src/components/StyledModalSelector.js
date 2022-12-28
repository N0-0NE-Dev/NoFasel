import React from "react";
import ModalSelector from "react-native-modal-selector";
import { Storage } from "../components/Storage";
import { StyleSheet } from "react-native";

const darkTheme = Storage.getBoolean("darkTheme");

const StyledModalSelector = ({
	initValue,
	handleChange,
	selectedKey,
	data,
}) => {
	return (
		<ModalSelector
			data={data}
			initValue={initValue}
			onChange={handleChange}
			initValueTextStyle={styles.optionTextStyle}
			style={styles.modalSelectorStyle}
			selectedKey={selectedKey}
			backdropPressToClose={true}
			selectTextStyle={styles.textStyle}
			optionContainerStyle={styles.optionContainerStyle}
			optionTextStyle={styles.optionTextStyle}
			cancelText="Cancel"
			cancelStyle={styles.cancelStyle}
			cancelTextStyle={styles.textStyle}
		/>
	);
};
const styles = StyleSheet.create({
	modalSelectorStyle: {
		borderColor: "black",
		borderWidth: 1,
		width: 250,
		alignSelf: "center",
		margin: 10,
		borderRadius: 5,
	},
	cancelStyle: {
		backgroundColor: darkTheme ? "black" : "white",
		borderWidth: 1,
		borderColor: darkTheme ? "white" : "black",
	},
	textStyle: {
		color: darkTheme ? "white" : "black",
	},
	optionTextStyle: {
		color: darkTheme ? "#add8e6" : "blue",
	},
	optionContainerStyle: {
		backgroundColor: darkTheme ? "black" : "white",
		borderColor: darkTheme ? "white" : "black",
		borderWidth: 1,
	},
});

export default StyledModalSelector;
