import { useCallback, useContext, useState } from "react";
import { View } from "react-native";
import { Gesture } from "react-native-gesture-handler";
import { GameRenderer, useRenderer } from "./GameRenderer";
import { useFocusEffect } from "expo-router";
import { SessionInfo } from "@/src/binary/sessionInfo";
import { COORDINATE_BYTE_WIDTH } from "@/src/binary/coordinate";
import { BufferState } from "@/src/binary/useBuffer";
import { GameContext } from "@/src/context/gameContext";
import { Text } from "react-native";
import { colors } from "@/src/colors";
import { useQuery } from "@tanstack/react-query";
import { SessionConfig } from "@/src/sessionConfig";

export default function GameView() {
    const ctx = useContext(GameContext);
    const [socket, setSocket] = useState<WebSocket | undefined>(undefined);
    const [empty, setEmpty] = useState(true);
    const [gameOver, setGameOver] = useState(false);
    const [playerCount, setPlayerCount] = useState(0);
    const [score, setScore] = useState(0);

    const configQuery = useQuery({
        queryKey: [`session-config-${ctx.getSessionKey()}`],
        queryFn: async () => {
            const key = ctx.getSessionKey();
            if (!key) {
                return;
            }

            return await getSessionConfig(key);
        },
    });

    const onSessionInfo = useCallback(
        (info: SessionInfo, buf: BufferState) => {
            setEmpty(false);

            if (info.type === "PlayerCount") {
                ctx.setPlayerCount(info.value);
                setPlayerCount(info.value);
            }

            if (info.type === "Score") {
                setScore(info.value);
            }

            if (info.type === "BoardSize") {
                ctx.setBoardSize(info.value);
                const bufSize =
                    info.value * info.value * COORDINATE_BYTE_WIDTH * 16;
                buf.reAllocateBuf(bufSize);
            }

            if (info.type === "GameOver") {
                setGameOver(true);
            }

            if (info.type === "Restart" && info.kind === "confirmed") {
                setGameOver(false);
            }

            if (info.type === "Restart" && info.kind === "denied") {
                setEmpty(true);
            }
        },
        [ctx],
    );

    useRenderer(socket, onSessionInfo);

    useFocusEffect(
        useCallback(() => {
            ctx.setMe(0);
            const url = `${process.env.EXPO_PUBLIC_WEBSOCKET_BASE_URL}/game/session/view/${ctx.getSessionKey()}`;
            const ws = new WebSocket(url);
            ws.binaryType = "arraybuffer";

            setSocket(ws);
            return () => {
                ws.close();
            };
        }, [ctx]),
    );

    return (
        <>
            <View
                style={{
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    alignItems: "center",
                    zIndex: 10,
                    position: "absolute",
                }}
            >
                {empty && (
                    <Text style={{ color: "#fff", fontWeight: "bold" }}>
                        Empty session
                    </Text>
                )}
                {!empty && configQuery.data && (
                    <Text
                        style={{
                            color: "#fff",

                            fontSize: 18,
                            fontWeight: "bold",
                        }}
                    >
                        Team : {configQuery.data.teamName}
                    </Text>
                )}
                {!empty && gameOver && (
                    <Text
                        style={{
                            color: colors.deny,
                            fontSize: 24,
                            fontWeight: "bold",
                        }}
                    >
                        Game Over
                    </Text>
                )}
                {!empty && gameOver && (
                    <Text
                        style={{
                            color: "#fff",
                            fontSize: 18,
                            fontWeight: "bold",
                        }}
                    >
                        Score {score}
                    </Text>
                )}
                {!empty && !gameOver && (
                    <Text style={{ color: "#fff" }}>Players {playerCount}</Text>
                )}
            </View>
            <GameRenderer onSwipe={Gesture.Race()} />
        </>
    );
}

async function getSessionConfig(
    key: string,
): Promise<SessionConfig | undefined> {
    const resp = await fetch(
        `${process.env.EXPO_PUBLIC_HTTP_BASE_URL}/game/session/${key}/config`,
        {
            headers: {
                "Content-Type": "application/json",
            },
        },
    );

    const data = await resp.json();
    if (typeof data !== "object") {
        console.warn("Expected object but received", data);
        return undefined;
    }

    return data as SessionConfig;
}
