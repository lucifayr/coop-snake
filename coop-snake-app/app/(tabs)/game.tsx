import GameScreen from "@/components/Game/GameScreen";
import { globalData } from "@/src/stores/globalStore";
import { router, useFocusEffect } from "expo-router";
import { useCallback } from "react";

export default function GameScreenShell() {
    useFocusEffect(
        useCallback(() => {
            if (!globalData.getSessionKey()) {
                router.replace("/new-session");
            }
        }, []),
    );

    return <GameScreen />;
}
