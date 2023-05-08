import React from "react";
import { Modal, Pressable, View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";

const DefaultSelector = ({
	visible,
	setVisible,
	itemList,
	theme,
	handlePress,
}) => {
	return (
		<Modal
			animationType="slide"
			transparent={true}
			visible={visible}
			statusBarTranslucent={true}>
			<Pressable
				style={{
					backgroundColor: "rgba(0,0,0,0.5)",
					position: "absolute",
					...StyleSheet.absoluteFillObject,
					justifyContent: "center",
					alignItems: "center",
				}}
				onPress={() => setVisible(false)}>
				<View
					style={{
						marginHorizontal: 20,
						borderRadius: 20,
						alignItems: "center",
						backgroundColor: theme.colors.background,
					}}>
					{Object.entries(itemList).map(item => (
						<Pressable
							key={item[0]}
							style={({ pressed }) => [
								{
									backgroundColor: pressed
										? 'rgba(50, 50, 50, 0.5)'
										: null,
								},
								{
									flexDirection: "row",
									margin: 10,
									paddingVertical: 10,
									borderRadius: 20,
								},
							]}
							onPress={() => handlePress(item)}>
							<Text
								style={{
									fontSize: 16,
									margin: 5,
									flex: 1,
									textAlign: "center",
								}}>
								{item[0]}
							</Text>
						</Pressable>
					))}
				</View>
			</Pressable>
		</Modal>
	);
};

export default DefaultSelector;
