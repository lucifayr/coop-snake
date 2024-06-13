import { SnakeProperties } from "@/components/Game/Snake";
import { GameLoop } from "@/src/gameLoop";
import { COORDINATE_BYTE_WIDTH, Coordinate } from "@/src/binary/coordinate";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import { ReactNode, useEffect, useRef } from "react";
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
    binMsgIntoBytes,
} from "@/src/binary/gameBinaryMessage";
import { GameCanvas } from "@/components/Game/GameCanvas";
import { useBuffer } from "@/src/binary/useBuffer";
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

export default function GameScreen() {
    const socket = useRef<WebSocket | undefined>(undefined);
    const token = useRef<number | undefined>(undefined);
    const { view: msgView, writeCanonicalBytes: msgWriteCanonicalBytes } =
        useBuffer(
            globalData.getBoardSize() *
                globalData.getBoardSize() *
                COORDINATE_BYTE_WIDTH *
                16,
        );

    useEffect(() => {
        const url = `${process.env.EXPO_PUBLIC_WEBSOCKET_BASE_URL}/game/session/${globalData.getSessionKey()}`;
        const ws = new WebSocket(url);

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
                globalData.setCoords(playerCoords.player, playerCoords.coords);
            }

            if (msg.messageType === "FoodPosition") {
                const foodCoord = foodCoordFromMsg(msg);
                globalData.setFood(foodCoord.player, foodCoord.coord);
            }
        };

        const onSessionInfo = (info: SessionInfo) => {
            if (info.type === "PlayerToken") {
                token.current = info.value;
            }

            if (info.type === "BoardSize") {
                globalData.setBoardSize(info.value);
            }

            if (info.type === "GameOver") {
                globalData.setGameOver(info.cause);
                Alert.alert(`Game Over : ${info.cause}`);
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
    }, [msgView, msgWriteCanonicalBytes]);

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

                <Pressable
                    style={{
                        display: "flex",
                        flexWrap: "nowrap",
                        flexDirection: "row",
                        marginLeft: 40,
                        width: "100%",
                    }}
                    onPress={() => router.navigate("/home")}
                >
                    <AntDesign name="caretleft" size={24} color="white" />
                    <Text style={{ color: "white", fontSize: 20 }}>Back</Text>
                </Pressable>
            </View>
        </GestureHandlerRootView>
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
        backgroundColor: "#EBAB9D",
        justifyContent: "space-around",
        alignItems: "center",
        // hacky spacing, feel free to change when adding more elements
        gap: 12,
        paddingVertical: 48,
    },
    gamepane: {
        width: "90%",
        aspectRatio: 1,
        height: undefined,
        flex: undefined,
        borderColor: "black",
        borderStyle: "solid",
        borderWidth: 2,
        borderRadius: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
    },
});
