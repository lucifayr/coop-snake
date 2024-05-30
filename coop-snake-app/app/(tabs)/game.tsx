import { Hidden } from "@/components/Game/Hidden";
import { Snake, SnakeProperties } from "@/components/Game/Snake";
import { GameLoop } from "@/src/gameLoop";
import { COORDINATE_BYTE_WIDTH, Coordinate } from "@/src/binary/coordinate";
import { Player } from "@/src/binary/player";
import { DEBUG_COORDS } from "@/src/debug/data";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import { ReactElement, ReactNode, useEffect, useRef } from "react";
import { Pressable, StatusBar, StyleSheet, Text, View } from "react-native";
import { GameEngine } from "react-native-game-engine";
import { playerCoordsFromMsg } from "@/src/playerCoords";
import {
    binMsgFromBytes,
    binMsgIntoBytes,
} from "@/src/binary/gameBinaryMessage";
import { GameCanvas } from "@/components/Game/GameCanvas";
import { useBuffer } from "@/src/binary/useBuffer";
import { GAME_CONSTANTS } from "@/src/gameConstants";
import {
    Gesture,
    Directions,
    GestureDetector,
    GestureHandlerRootView,
    ComposedGesture,
} from "react-native-gesture-handler";
import { getTickN, setCoords, setTickN } from "@/src/stores/globalStore";
import { swipeInputMsg } from "@/src/binary/swipe";

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
    debug: {
        data?: {
            rawCoords: Uint8Array;
            rawCoordsOffset: number;
        };
        renderer: ReactElement;
    };
};

export default function GameScreen() {
    const isDebugActive = process.env.EXPO_PUBLIC_DEBUG === "true";

    const socket = useRef<WebSocket | undefined>(undefined);

    const { view: msgView, writeCanonicalBytes: msgWriteCanonicalBytes } =
        useBuffer(
            GAME_CONSTANTS.GRID_SIZE *
                GAME_CONSTANTS.GRID_SIZE *
                COORDINATE_BYTE_WIDTH *
                16,
        );

    useEffect(() => {
        if (isDebugActive) {
            return;
        }

        const url = `${process.env.EXPO_PUBLIC_WEBSOCKET_BASE_URL}/game/tmp`;
        const ws = new WebSocket(url);

        const errCallback = (e: any) => {
            console.error(`WebSocket error: ${e}`);
        };

        const msgCallback = (e: any) => {
            const data = e?.data;
            const isBinary = data instanceof ArrayBuffer;
            if (!isBinary) {
                return;
            }

            msgWriteCanonicalBytes(new DataView(data));
            const msg = binMsgFromBytes(msgView());

            if (msg.messageType === "PlayerPosition") {
                const playerCoords = playerCoordsFromMsg(msg);
                setTickN(playerCoords.tickN);
                setCoords(playerCoords.player, playerCoords.coords);
            }
        };

        ws.addEventListener("message", msgCallback);
        ws.addEventListener("error", errCallback);

        socket.current = ws;

        return () => {
            ws.removeEventListener("message", msgCallback);
            ws.removeEventListener("error", errCallback);
            ws.close();
        };
    }, [isDebugActive, msgView, msgWriteCanonicalBytes]);

    return (
        <GameScreenContainer>
            <GestureDetector
                gesture={swipeGestures({
                    up: () => {
                        const msg = swipeInputMsg("up", getTickN());
                        socket.current?.send(binMsgIntoBytes(msg));
                    },
                    right: () => {
                        const msg = swipeInputMsg("right", getTickN());
                        socket.current?.send(binMsgIntoBytes(msg));
                    },
                    down: () => {
                        const msg = swipeInputMsg("down", getTickN());
                        socket.current?.send(binMsgIntoBytes(msg));
                    },
                    left: () => {
                        const msg = swipeInputMsg("left", getTickN());
                        socket.current?.send(binMsgIntoBytes(msg));
                    },
                })}
            >
                <GameEngine
                    renderer={GameCanvas}
                    systems={[GameLoop]}
                    entities={initialEntities(isDebugActive)}
                    running={true}
                >
                    <StatusBar hidden={true} />
                </GameEngine>
            </GestureDetector>
        </GameScreenContainer>
    );
}

function GameScreenContainer({ children }: { children: ReactNode }) {
    return (
        <View style={styles.container}>
            <View style={styles.gamepane}>
                <GestureHandlerRootView>{children}</GestureHandlerRootView>
            </View>

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
    );
}

function initialEntities(isDebug: boolean): GameEntities {
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
        // TODO: massive HACK, please fix asap
        debug: {
            data: isDebug
                ? {
                      rawCoords: DEBUG_COORDS,
                      rawCoordsOffset: 0,
                  }
                : undefined,
            renderer: <Hidden />,
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
