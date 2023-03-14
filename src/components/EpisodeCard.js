import React from "react";
import { Pressable, ImageBackground, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/FontAwesome";
import { Text } from "react-native-paper";

const EpisodeCard = ({
	label,
	posterSource,
	source,
	setSelectedEpisode,
	setShowLoading,
	setQualities,
	provider,
	selectedEpisode,
	theme,
	resume,
	category,
	setWebpageUrl
}) => {
	return (
		<Pressable
			onPress={() => {
				setSelectedEpisode(source);
				setShowLoading(true);
				setQualities(null);
				if (provider == "fasel" && !(category == "arabic-series")) {
					setWebpageUrl(
						`https://embed.scdn.to/video_player?uid=0&vid=${source}`,
					);
				} else if (category == "arabic-series") {
					setWebpageUrl(source);
				} else if (provider == "hdw") {
					setWebpageUrl(`https://www.hdwatched.xyz/embed/${source}`);
				} else {
					// pass
				}
			}}>
			<ImageBackground
				source={{ uri: posterSource }}
				style={{ height: 150, width: 150, margin: 5 }}
				imageStyle={{ borderRadius: 15 }}>
				<LinearGradient
					colors={["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 1)"]}
					style={{ flex: 1, justifyContent: "flex-end", borderRadius: 15 }}>
					<View
						style={{
							justifyContent: "center",
							alignItems: "center",
							flex: 1,
						}}>
						<Icon
							name="play-circle"
							size={34}
							color={source == selectedEpisode ? theme.colors.primary : "white"}
							style={{ marginTop: 20 }}
						/>
					</View>
					<View style={{ justifyContent: "center" }}>
						<Text style={{ margin: 10, fontWeight: "bold", color: "white" }}>
							{label}
						</Text>
					</View>
					{resume.hasOwnProperty(source + category) && (
						<View
							style={{
								height: 10,
								width:
									(Number(resume[source + category]["resume"]) /
										Number(resume[source + category]["duration"])) *
									135,
								backgroundColor: theme.colors.primary,
								borderRadius: 15,
							}}
						/>
					)}
				</LinearGradient>
			</ImageBackground>
		</Pressable>
	);
};

export default EpisodeCard;
