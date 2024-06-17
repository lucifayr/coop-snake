import { SnakeProperties } from "@/components/Game/Snake";
import { GameLoop } from "@/src/gameLoop";
import { COORDINATE_BYTE_WIDTH, Coordinate } from "@/src/binary/coordinate";
import { router, useFocusEffect } from "expo-router";
import { ReactNode, useCallback, useRef, useState } from "react";
import {
    Alert,
    Pressable,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { GameEngine } from "react-native-game-engine";
import { playerCoordsFromMsg } from "@/src/playerCoords";
import {
    binMsgFromBytes,
    binMsgFromData,
    binMsgIntoBytes,
} from "@/src/binary/gameBinaryMessage";
import { GameCanvas } from "@/components/Game/GameCanvas";
import { staticBuffer } from "@/src/binary/useBuffer";
import {
    Gesture,
    Directions,
    GestureDetector,
    GestureHandlerRootView,
    ComposedGesture,
    FlingGesture,
} from "react-native-gesture-handler";
import { globalData } from "@/src/stores/globalStore";
import { swipeInputMsg } from "@/src/binary/swipe";
import { SessionInfo, parseSessionInfoMsg } from "@/src/binary/sessionInfo";
import { foodCoordFromMsg } from "@/src/foodCoords";
import { FoodProperties } from "@/components/Game/Food";
import { colors } from "@/src/colors";
import { u32ToBytes } from "@/src/binary/utils";

export type GameEntities = {
    players: {
        [key: number]: {
            playerId: number;
            coords: Coordinate[];
            renderer: React.ComponentType<SnakeProperties>;
        };
    };
    foods: {
        [key: number]: {
            playerId: number;
            coord: Coordinate | undefined;
            renderer: React.ComponentType<FoodProperties>;
        };
    };
};

const {
    view: msgView,
    writeCanonicalBytes: msgWriteCanonicalBytes,
    reAllocateBuf: msgReAllocateBuf,
} = staticBuffer(
    globalData.getBoardSize() *
        globalData.getBoardSize() *
        COORDINATE_BYTE_WIDTH *
        16,
);

export default function GameScreenInternal() {
    const [waitingFor, setWaitingFor] = useState(100_000);
    const [score, setScore] = useState(0);

    const socket = useRef<WebSocket | undefined>(undefined);
    const token = useRef<number | undefined>(undefined);
    useFocusEffect(
        useCallback(() => {
            const url = `${process.env.EXPO_PUBLIC_WEBSOCKET_BASE_URL}/game/session/${globalData.getSessionKey()}`;
            const ws = new WebSocket(url);
            ws.binaryType = "arraybuffer";

            const onErr = (e: WebSocketMessageEvent) => {
                console.error("WebSocket error:", e);
            };

            const onMsg = (e: WebSocketMessageEvent) => {
                const data = e.data;
                const isBinary = data instanceof ArrayBuffer;
                if (isBinary) {
                    onBinMsg(data);
                }
            };

            const onBinMsg = (data: ArrayBuffer) => {
                msgWriteCanonicalBytes(new DataView(data));
                const msg = binMsgFromBytes(msgView());

                if (msg.messageType === "SessionInfo") {
                    const info = parseSessionInfoMsg(msg.data);
                    onSessionInfo(info);
                }

                if (msg.messageType === "PlayerPosition") {
                    const playerCoords = playerCoordsFromMsg(msg);
                    globalData.setTickN(playerCoords.tickN);
                    globalData.setCoords(
                        playerCoords.player,
                        playerCoords.coords,
                    );
                }

                if (msg.messageType === "FoodPosition") {
                    const foodCoord = foodCoordFromMsg(msg);
                    globalData.setFood(foodCoord.player, foodCoord.coord);
                }
            };

            const onSessionInfo = (info: SessionInfo) => {
                if (info.type === "PlayerId") {
                    globalData.setMe(info.value);
                }

                if (info.type === "PlayerToken") {
                    token.current = info.value;
                }

                if (info.type === "PlayerCount") {
                    globalData.setPlayerCount(info.value);
                }

                if (info.type === "BoardSize") {
                    globalData.setBoardSize(info.value);
                    const bufSize =
                        info.value * info.value * COORDINATE_BYTE_WIDTH * 16;
                    msgReAllocateBuf(bufSize);
                }

                if (info.type === "WaitingFor") {
                    setWaitingFor(info.value);
                }

                if (info.type === "GameOver") {
                    globalData.setGameOver(info.cause);
                    setWaitingFor(globalData.getPlayerCount());
                }

                if (info.type === "Score") {
                    setScore(info.value);
                }

                if (info.type === "Restart" && info.kind === "confirmed") {
                    globalData.resetGameOver();
                    setWaitingFor(0);
                }

                if (info.type === "Restart" && info.kind === "denied") {
                    Alert.alert(
                        "Closing Session",
                        "Not all players wanted play again",
                    );

                    router.replace("/home");
                }
            };

            ws.addEventListener("message", onMsg);
            ws.addEventListener("error", onErr);

            socket.current = ws;

            return () => {
                ws.removeEventListener("message", onMsg);
                ws.removeEventListener("error", onErr);
                ws.close();
            };
        }, []),
    );

    if (waitingFor > 0) {
        return (
            <WaitingFor>
                {globalData.getGameOverInfo().gameOver ? (
                    <WaitForRestart
                        waitingFor={waitingFor}
                        score={score}
                        ws={socket.current!}
                        token={token.current!}
                    />
                ) : (
                    <WaitForJoin
                        sessionKey={globalData.getSessionKey() ?? "---"}
                        waitingFor={waitingFor}
                    />
                )}
            </WaitingFor>
        );
    }

    return (
        <GameScreenContainer
            onSwipe={swipeGestures({
                UP: () => {
                    const msg = swipeInputMsg(
                        "up",
                        globalData.getTickN(),
                        token.current,
                    );
                    socket.current?.send(binMsgIntoBytes(msg));
                },
                RIGHT: () => {
                    const msg = swipeInputMsg(
                        "right",
                        globalData.getTickN(),
                        token.current,
                    );
                    socket.current?.send(binMsgIntoBytes(msg));
                },
                DOWN: () => {
                    const msg = swipeInputMsg(
                        "down",
                        globalData.getTickN(),
                        token.current,
                    );
                    socket.current?.send(binMsgIntoBytes(msg));
                },
                LEFT: () => {
                    const msg = swipeInputMsg(
                        "left",
                        globalData.getTickN(),
                        token.current,
                    );
                    socket.current?.send(binMsgIntoBytes(msg));
                },
            })}
        >
            <GameEngine
                style={{ width: "100%", height: "100%" }}
                renderer={GameCanvas}
                systems={[GameLoop]}
                entities={initialEntities()}
                running={true}
            >
                <StatusBar hidden={true} />
            </GameEngine>
        </GameScreenContainer>
    );
}

function GameScreenContainer({
    children,
    onSwipe,
}: {
    children: ReactNode;
    onSwipe: ComposedGesture;
}) {
    return (
        <GestureHandlerRootView>
            <View style={styles.container}>
                <GestureDetector gesture={onSwipe}>
                    <View style={{ flexGrow: 1 }}>
                        <View style={styles.gamepane}>{children}</View>
                    </View>
                </GestureDetector>
            </View>
        </GestureHandlerRootView>
    );
}

function WaitingFor({ children }: { children: ReactNode }) {
    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: colors.bgDark,
            }}
        >
            <View
                style={{
                    padding: 24,
                    backgroundColor: colors.bg,
                    borderRadius: 4,
                    width: "50%",
                    alignItems: "center",
                    gap: 12,
                }}
            >
                {children}
            </View>
        </View>
    );
}

function WaitForRestart({
    waitingFor,
    score,
    ws,
    token,
}: {
    waitingFor: number;
    score: number;
    ws: WebSocket | undefined;
    token: number | undefined;
}) {
    const [choice, setChoice] = useState<"confirm" | "deny" | undefined>(
        undefined,
    );

    const confirm = () => {
        if (choice || !ws || !token) {
            return;
        }

        setChoice("confirm");
        const tokenBytes = u32ToBytes(token);
        const msg = binMsgFromData(
            "PlayerRestartConfirm",
            new DataView(Uint8Array.of(...tokenBytes).buffer),
        );

        ws.send(binMsgIntoBytes(msg));
    };

    const deny = () => {
        if (choice || !ws || !token) {
            return;
        }

        setChoice("deny");
        const tokenBytes = u32ToBytes(token);
        const msg = binMsgFromData(
            "PlayerRestartDeny",
            new DataView(Uint8Array.of(...tokenBytes).buffer),
        );

        ws.send(binMsgIntoBytes(msg));
    };

    return (
        <View style={{ gap: 42, alignItems: "center" }}>
            <View style={{ alignItems: "center" }}>
                <Text
                    style={{
                        color: "#fff",
                        fontSize: 16,
                        fontWeight: 800,
                        paddingBottom: 12,
                    }}
                >
                    Game Over
                </Text>
                <Text
                    style={{
                        color: "#fff",
                        fontSize: 14,
                    }}
                >
                    Score
                </Text>
                <Text
                    style={{
                        color: "#fff",
                        fontSize: 20,
                        fontWeight: 900,
                    }}
                >
                    {score}
                </Text>
            </View>
            <View style={{ alignItems: "center", gap: 4 }}>
                <Text style={{ color: "#fff", fontSize: 14 }}>Try again?</Text>
                <View
                    style={{
                        width: "100%",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        gap: 12,
                        padding: 4,
                    }}
                >
                    <Pressable
                        onPress={() => confirm()}
                        disabled={choice !== undefined}
                        style={{
                            backgroundColor:
                                choice === "deny"
                                    ? colors.disabled
                                    : colors.confirm,
                            width: "50%",
                            padding: 8,
                            alignItems: "center",
                        }}
                    >
                        <Text style={{ color: "#fff" }}>Yes</Text>
                    </Pressable>
                    <Pressable
                        onPress={() => deny()}
                        disabled={choice !== undefined}
                        style={{
                            backgroundColor:
                                choice === "confirm"
                                    ? colors.disabled
                                    : colors.deny,
                            width: "50%",
                            padding: 8,
                            alignItems: "center",
                        }}
                    >
                        <Text style={{ color: "#fff" }}>No</Text>
                    </Pressable>
                </View>
                <Text style={{ color: "#fff", fontSize: 12 }}>
                    Waiting for: {waitingFor}
                </Text>
            </View>
        </View>
    );
}

function WaitForJoin({
    sessionKey,
    waitingFor,
}: {
    sessionKey: string;
    waitingFor: number;
}) {
    return (
        <>
            <View style={{ alignItems: "center" }}>
                <Text style={{ color: "#fff", fontSize: 12 }}>Key</Text>
                <Text
                    style={{
                        userSelect: "all",
                        color: "#fff",
                        fontWeight: 900,
                        fontSize: 16,
                    }}
                >
                    {sessionKey}
                </Text>
            </View>
            <Text style={{ color: "#fff", fontSize: 12 }}>
                Waiting for: {waitingFor}
            </Text>
        </>
    );
}

function initialEntities(): GameEntities {
    return {
        players: [],
        foods: [],
    };
}

type SwipeCallbacks = {
    UP: () => void;
    RIGHT: () => void;
    DOWN: () => void;
    LEFT: () => void;
};

function swipeGestures(callbacks: SwipeCallbacks): ComposedGesture {
    const gesUp = swipe("UP", callbacks);
    const gesRight = swipe("RIGHT", callbacks);
    const gesDown = swipe("DOWN", callbacks);
    const gesLeft = swipe("LEFT", callbacks);

    const gesUpRight = diagonalSwipe("UP", "RIGHT", callbacks);
    const gesUpLeft = diagonalSwipe("UP", "LEFT", callbacks);
    const gesDownRight = diagonalSwipe("DOWN", "RIGHT", callbacks);
    const gesDownLeft = diagonalSwipe("DOWN", "LEFT", callbacks);

    return Gesture.Exclusive(
        gesUp,
        gesRight,
        gesDown,
        gesLeft,
        gesUpRight,
        gesUpLeft,
        gesDownRight,
        gesDownLeft,
    );
}

function swipe(
    dir: keyof typeof Directions,
    callbacks: SwipeCallbacks,
): FlingGesture {
    const gesture = Gesture.Fling();
    gesture.config.direction = Directions[dir];
    gesture.onEnd(() => {
        callbacks[dir]();
    });

    return gesture;
}

function diagonalSwipe(
    dir1: keyof typeof Directions,
    dir2: keyof typeof Directions,
    callbacks: SwipeCallbacks,
): FlingGesture {
    const gesture = Gesture.Fling();
    gesture.config.direction = Directions[dir1] | Directions[dir2];
    gesture.onEnd(() => {
        if (globalData.getDirection(globalData.me()) === dir1) {
            callbacks[dir2]();
        } else {
            callbacks[dir1]();
        }
    });

    return gesture;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#27272a",
        justifyContent: "space-around",
        alignItems: "center",
        // hacky spacing, feel free to change when adding more elements
        gap: 12,
        paddingVertical: 48,
    },
    gamepane: {
        height: "66%",
        aspectRatio: 1,
        flex: undefined,
        borderColor: colors.gameBorders,
        borderStyle: "solid",
        borderWidth: 2,
        borderRadius: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
    },
});
