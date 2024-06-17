import GameScreen from "@/components/Game/GameScreen";
import { GameContextProvider } from "@/src/context/gameContext";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback } from "react";

export default function GameScreenShell() {
    const { sessionKey } = useLocalSearchParams<{ sessionKey?: string }>();

    useFocusEffect(
        useCallback(() => {
            if (!sessionKey) {
                router.replace("/home");
                return;
            }
        }, []),
    );

    return (
        <GameContextProvider sessionKey={sessionKey}>
            <GameScreen />
        </GameContextProvider>
    );
}
