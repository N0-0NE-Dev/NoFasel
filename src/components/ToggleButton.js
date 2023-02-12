import React, { useState } from "react";
import { Button, useTheme } from "react-native-paper";
import { StyleSheet } from "react-native";

const ToggleButton = ({ title, filters, setFilters, value }) => {
	const theme = useTheme();
	const [toggled, setToggled] = useState(
		filters.includes(value) ? true : false
	);

	const handleAddition = () => {
		if (toggled) {
			let temp = filters;
			temp = temp.filter((item) => item !== value);
			setFilters(temp);
			setToggled(false);
		} else {
			setFilters([...filters, value]);
			setToggled(true);
		}
	};

	const styles = StyleSheet.create({
		buttonStyle: {
			margin: 10,
			borderColor: theme.colors.primary,
			borderWidth: 2.5,
		},
	});

	return (
		<Button
			mode={toggled ? "contained" : "outlined"}
			onPress={handleAddition}
			style={styles.buttonStyle}
			labelStyle={{ fontWeight: "bold" }}
		>
			{title}
		</Button>
	);
};

export default ToggleButton;
