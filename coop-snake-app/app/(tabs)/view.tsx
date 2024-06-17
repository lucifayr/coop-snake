import GameScreenSpectator from "@/components/Game/GameScreenSpectator";
import { GameContextProvider } from "@/src/context/gameContext";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback } from "react";

export default function GameScreenShell() {
    const { sessionKey } = useLocalSearchParams<{ sessionKey?: string }>();

    useFocusEffect(
        useCallback(() => {
            if (!sessionKey) {
                router.replace("/home");
            }
        }, []),
    );

    return (
        <GameContextProvider sessionKey={sessionKey}>
            <GameScreenSpectator />
        </GameContextProvider>
    );
}
