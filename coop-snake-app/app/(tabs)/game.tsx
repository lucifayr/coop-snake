import { Snake, SnakeProperties } from "@/components/Game/Snake";
import { GameLoop } from "@/src/gameLoop";
import { COORDINATE_BYTE_WIDTH, Coordinate } from "@/src/binary/coordinate";
import { Player } from "@/src/binary/player";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import { ReactNode, useEffect, useRef } from "react";
import { Pressable, StatusBar, StyleSheet, Text, View } from "react-native";
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
} from "react-native-gesture-handler";
import { global } from "@/src/stores/globalStore";
import { swipeInputMsg } from "@/src/binary/swipe";
import { SessionInfo, parseSessionInfoMsg } from "@/src/binary/sessionInfo";
import { foodCoordFromMsg } from "@/src/foodCoords";
import { Food, FoodProperties } from "@/components/Game/Food";

export type GameEntities = {
    player1: {
        playerId: Player;
        coords: Coordinate[];
        renderer: React.ComponentType<SnakeProperties>;
    };
    player2: {
        playerId: Player;
        coords: Coordinate[];
        renderer: React.ComponentType<SnakeProperties>;
    };
    food1: {
        playerId: Player;
        coord: Coordinate | undefined;
        renderer: React.ComponentType<FoodProperties>;
    };
    food2: {
        playerId: Player;
        coord: Coordinate | undefined;
        renderer: React.ComponentType<FoodProperties>;
    };
};

export default function GameScreen() {
    const socket = useRef<WebSocket | undefined>(undefined);
    const token = useRef<number | undefined>(undefined);
    const { view: msgView, writeCanonicalBytes: msgWriteCanonicalBytes } =
        useBuffer(
            global.getBoardSize() *
                global.getBoardSize() *
                COORDINATE_BYTE_WIDTH *
                16,
        );

    useEffect(() => {
        const url = `${process.env.EXPO_PUBLIC_WEBSOCKET_BASE_URL}/game/tmp`;
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
                global.setTickN(playerCoords.tickN);
                global.setCoords(playerCoords.player, playerCoords.coords);
            }

            if (msg.messageType === "FoodPosition") {
                const foodCoord = foodCoordFromMsg(msg);
                global.setFood(foodCoord.player, foodCoord.coord);
            }
        };

        const onSessionInfo = (info: SessionInfo) => {
            if (info.type === "PlayerToken") {
                token.current = info.value;
            }

            if (info.type === "BoardSize") {
                global.setBoardSize(info.value);
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
                up: () => {
                    const msg = swipeInputMsg(
                        "up",
                        global.getTickN(),
                        token.current,
                    );
                    socket.current?.send(binMsgIntoBytes(msg));
                },
                right: () => {
                    const msg = swipeInputMsg(
                        "right",
                        global.getTickN(),
                        token.current,
                    );
                    socket.current?.send(binMsgIntoBytes(msg));
                },
                down: () => {
                    const msg = swipeInputMsg(
                        "down",
                        global.getTickN(),
                        token.current,
                    );
                    socket.current?.send(binMsgIntoBytes(msg));
                },
                left: () => {
                    const msg = swipeInputMsg(
                        "left",
                        global.getTickN(),
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
        player1: {
            playerId: "Player1",
            coords: [],
            renderer: Snake,
        },
        player2: {
            playerId: "Player2",
            coords: [],
            renderer: Snake,
        },
        food1: {
            playerId: "Player1",
            coord: undefined,
            renderer: Food,
        },
        food2: {
            playerId: "Player2",
            coord: undefined,
            renderer: Food,
        },
    };
}

function swipeGestures(callbacks: {
    up: () => void;
    right: () => void;
    down: () => void;
    left: () => void;
}): ComposedGesture {
    const gestureSwipeUp = Gesture.Fling();
    gestureSwipeUp.config.direction = Directions.UP;
    gestureSwipeUp.onEnd(callbacks.up);

    const gestureSwipeRight = Gesture.Fling();
    gestureSwipeRight.config.direction = Directions.RIGHT;
    gestureSwipeRight.onEnd(callbacks.right);

    const gestureSwipeDown = Gesture.Fling();
    gestureSwipeDown.config.direction = Directions.DOWN;
    gestureSwipeDown.onEnd(callbacks.down);

    const gestureSwipeLeft = Gesture.Fling();
    gestureSwipeLeft.config.direction = Directions.LEFT;
    gestureSwipeLeft.onEnd(callbacks.left);

    return Gesture.Race(
        gestureSwipeUp,
        gestureSwipeRight,
        gestureSwipeDown,
        gestureSwipeLeft,
    );
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
