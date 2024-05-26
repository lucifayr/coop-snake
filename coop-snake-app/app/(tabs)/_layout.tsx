import { Tabs } from "expo-router";
import React from "react";
import { Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TabLayout() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#EBAB9D",
        position: "absolute",
        top: 0,
        width: "100%",
        height: Dimensions.get("window").height,
      }}
    >
      <Tabs
        screenOptions={{
          tabBarStyle: {
            display: "none",
          },
          headerShown: false,
        }}
      >
        <Tabs.Screen name="home" />
        <Tabs.Screen name="game" />
        <Tabs.Screen name="highscores" />
      </Tabs>
    </SafeAreaView>
  );
}
