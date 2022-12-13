import React from "react";
import { Foundation } from "@expo/vector-icons";

const HeaderSearchIcon = ({ navigation }) => {
	return (
		<Foundation
			name="magnifying-glass"
			size={30}
			color="black"
			style={{ margin: 10 }}
			onPress={() => navigation.navigate("Search")}
		/>
	);
};

export default HeaderSearchIcon;
