import React from "react";
import { Foundation } from "@expo/vector-icons";
import { Storage } from "./Storage";

const darkTheme = Storage.getBoolean("darkTheme");

const HeaderSearchIcon = ({ navigation }) => {
	return (
		<Foundation
			name="magnifying-glass"
			size={30}
			color={darkTheme ? "white" : "black"}
			style={{ marginRight: 10 }}
			onPress={() => navigation.navigate("Search")}
		/>
	);
};

export default HeaderSearchIcon;
