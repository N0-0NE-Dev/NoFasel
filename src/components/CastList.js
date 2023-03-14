import React from "react";
import { View, ScrollView, Image } from "react-native";
import { Text } from "react-native-paper";

const CastCard = ({ name, role, imageUrl }) => {
	return (
		<View style={{ flexDirection: "row", margin: 10 }}>
			<Image
				source={{ uri: "https://image.tmdb.org/t/p/original" + imageUrl }}
				style={{ width: 70, height: 70, borderRadius: 50 }}
			/>
			<View style={{ justifyContent: "center" }}>
				<Text style={{ marginHorizontal: 5, fontWeight: "bold" }}>{name}</Text>
				<Text style={{ margin: 5, color: "grey" }}>{role}</Text>
			</View>
		</View>
	);
};

const CastList = ({ castList }) => {
	if (castList !== "N/A") {
		return (
			<ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
				{castList.slice(0, 10).map(item => (
					<CastCard
						name={item.name}
						role={item.known_for_department}
						imageUrl={item.profile_path}
						key={item.name + item.known_for_department}
					/>
				))}
			</ScrollView>
		);
	} else {
		return;
	}
};

export default CastList;
