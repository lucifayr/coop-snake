import GameScreen from "@/components/Game/GameScreenSpectator";
import { globalData } from "@/src/stores/globalStore";
import { router, useFocusEffect } from "expo-router";
import { useCallback } from "react";

export default function GameScreenShell() {
    useFocusEffect(
        useCallback(() => {
            if (!globalData.getSessionKey()) {
                router.replace("/home");
            }
        }, []),
    );

    return <GameScreen />;
}
