import { useCallback, useContext, useState } from "react";
import { Alert } from "react-native";
import { Gesture } from "react-native-gesture-handler";
import { GameRenderer, useRenderer } from "./GameRenderer";
import { router, useFocusEffect } from "expo-router";
import { SessionInfo } from "@/src/binary/sessionInfo";
import { COORDINATE_BYTE_WIDTH } from "@/src/binary/coordinate";
import { BufferState } from "@/src/binary/useBuffer";
import { GameContext } from "@/src/context/gameContext";

export default function GameView() {
    const ctx = useContext(GameContext);
    const [socket, setSocket] = useState<WebSocket | undefined>(undefined);

    const onSessionInfo = useCallback(
        (info: SessionInfo, buf: BufferState) => {
            if (info.type === "PlayerCount") {
                ctx.setPlayerCount(info.value);
            }

            if (info.type === "BoardSize") {
                ctx.setBoardSize(info.value);
                const bufSize =
                    info.value * info.value * COORDINATE_BYTE_WIDTH * 16;
                buf.reAllocateBuf(bufSize);
            }

            if (info.type === "Restart" && info.kind === "denied") {
                Alert.alert(
                    "Closing Session",
                    "Not all players wanted play again",
                );
                router.replace("/home");
            }
        },
        [ctx],
    );

    useRenderer(socket, onSessionInfo);

    useFocusEffect(
        useCallback(() => {
            const url = `${process.env.EXPO_PUBLIC_WEBSOCKET_BASE_URL}/game/session/view/${ctx.getSessionKey()}`;
            const ws = new WebSocket(url);
            ws.binaryType = "arraybuffer";

            setSocket(ws);
            return () => {
                ws.close();
            };
        }, [ctx]),
    );

    return <GameRenderer onSwipe={Gesture.Race()} />;
}
