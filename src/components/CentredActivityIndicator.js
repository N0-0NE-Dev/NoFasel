import React from "react";
import { View } from "react-native";
import { useTheme, ActivityIndicator } from "react-native-paper";

const CentredActivityIndicator = () => {
	const theme = useTheme();

	return (
		<View
			style={{
				justifyContent: "center",
				flex: 1,
				backgroundColor: theme.colors.background,
			}}
		>
			<ActivityIndicator size={50} />
		</View>
	);
};

export default CentredActivityIndicator;
