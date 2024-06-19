import { colors } from "@/src/colors";
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function TabLayout() {
    return (
        <>
            <StatusBar backgroundColor={colors.bg} hidden={true}></StatusBar>

            <SafeAreaProvider>
                <SafeAreaView
                    style={{
                        flex: 1,
                        backgroundColor: colors.bg,
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
            </SafeAreaProvider>
        </>
    );
}
