import React from "react";
import { Button } from "react-native-paper";
import { FlatList } from "react-native";

const ActionButtons = ({
	showModal,
	setType,
	theme,
	tmdbId,
	category,
	provider,
}) => {
	const defaultBehaviour = label => {
		showModal();
		setType(label);
	};

	const buttonsData = [
		{
			mode: "contained",
			icon: "play-circle",
			label: "Play",
			onPress: () => defaultBehaviour("Play"),
			labelColor: theme.colors.onPrimary,
		},
		{
			mode: "contained",
			icon: "vlc",
			type: "vlc",
			label: "Open In VLC",
			color: "orange",
			onPress: () => defaultBehaviour("Open In VLC"),
			labelColor: "black",
		},
		{
			mode: "contained",
			icon: require("../assets/TMDbLogo.png"),
			label: "TMDb",
			color: "#0d253f",
			labelColor: "white",
			onPress: () =>
				Linking.openURL(
					`https://www.themoviedb.org/${
						category == "movies" ? "movie" : "tv"
					}/${tmdbId}`,
				),
		},
		{
			mode: "outlined",
			icon: "content-copy",
			label: "Copy",
			onPress: () => defaultBehaviour("Copy"),
			labelColor: theme.colors.primary,
		},
	];

	if (provider == "hdw" || category.includes("arabic")) {
		const downloadButtonData = {
			mode: "outlined",
			icon: "tray-arrow-down",
			label: "Download",
			onPress: () => defaultBehaviour("Download"),
			labelColor: theme.colors.primary,
		};
		buttonsData.splice(3, 0, downloadButtonData);
	} else {
		// pass
	}

	return (
		<FlatList
			horizontal={true}
			showsHorizontalScrollIndicator={false}
			data={buttonsData}
			renderItem={({ item }) => {
				return (
					<Button
						labelStyle={{ color: item.labelColor }}
						mode={item.mode}
						icon={item.icon}
						onPress={item.onPress}
						buttonColor={item.color}
						style={{ marginVertical: 10, marginHorizontal: 5 }}
						key={item.label}>
						{item.label}
					</Button>
				);
			}}
		/>
	);
};

export default ActionButtons;
