import { BackButton } from "../Back";
import {
    binMsgFromData,
    binMsgIntoBytes,
} from "@/src/binary/gameBinaryMessage";
import { u32ToBytes } from "@/src/binary/utils";
import { colors } from "@/src/colors";
import { ReactNode, useCallback, useContext, useRef, useState } from "react";
import { View, Text, Pressable, Alert } from "react-native";
import {
    ComposedGesture,
    Directions,
    FlingGesture,
    Gesture,
} from "react-native-gesture-handler";
import { GameRenderer, useRenderer } from "./GameRenderer";
import { router, useFocusEffect } from "expo-router";
import { SessionInfo } from "@/src/binary/sessionInfo";
import { COORDINATE_BYTE_WIDTH } from "@/src/binary/coordinate";
import { BufferState } from "@/src/binary/useBuffer";
import { swipeInputMsg } from "@/src/binary/swipe";
import { GameContext, GameContextApi } from "@/src/context/gameContext";

export default function GameScreenInteractive() {
    const ctx = useContext(GameContext);
    const [waitingFor, setWaitingFor] = useState(100_000);
    const [score, setScore] = useState(0);
    const [socket, setSocket] = useState<WebSocket | undefined>(undefined);
    const [renderedKey, setRenderedKey] = useState(ctx.getSessionKey());

    const token = useRef<number | undefined>(undefined);

    const onSessionInfo = useCallback(
        (info: SessionInfo, buf: BufferState) => {
            if (info.type === "PlayerId") {
                ctx.setMe(info.value);
            }

            if (info.type === "PlayerToken") {
                token.current = info.value;
            }

            if (info.type === "PlayerCount") {
                ctx.setPlayerCount(info.value);
            }

            if (info.type === "BoardSize") {
                ctx.setBoardSize(info.value);
                const bufSize =
                    info.value * info.value * COORDINATE_BYTE_WIDTH * 16;
                buf.reAllocateBuf(bufSize);
            }

            if (info.type === "WaitingFor") {
                setWaitingFor(info.value);
            }

            if (info.type === "GameOver") {
                ctx.setGameOver(info.cause);
                setWaitingFor(ctx.getPlayerCount());
            }

            if (info.type === "Score") {
                setScore(info.value);
            }

            if (info.type === "Restart" && info.kind === "confirmed") {
                ctx.resetGameOver();
                setWaitingFor(0);
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
            const key = ctx.getSessionKey();
            const url = `${process.env.EXPO_PUBLIC_WEBSOCKET_BASE_URL}/game/session/${key}`;
            const ws = new WebSocket(url);
            ws.binaryType = "arraybuffer";

            setSocket(ws);
            setRenderedKey(key);
            return () => {
                ws.close();
            };
        }, [ctx]),
    );

    if (waitingFor > 0) {
        return (
            <WaitingFor>
                {ctx.getGameOverInfo().gameOver ? (
                    <WaitForRestart
                        waitingFor={waitingFor}
                        score={score}
                        ws={socket!}
                        token={token.current!}
                    />
                ) : (
                    <WaitForJoin
                        sessionKey={renderedKey ?? "---"}
                        waitingFor={waitingFor}
                    />
                )}
            </WaitingFor>
        );
    }

    return (
        <View
            style={{
                backgroundColor: colors.bg,
                height: "100%",
                width: "100%",
                padding: 8,
            }}
        >
            <GameRenderer
                onSwipe={swipeGestures(ctx, {
                    UP: () => {
                        const msg = swipeInputMsg(
                            "up",
                            ctx.getTickN(),
                            token.current,
                        );
                        socket?.send(binMsgIntoBytes(msg));
                    },
                    RIGHT: () => {
                        const msg = swipeInputMsg(
                            "right",
                            ctx.getTickN(),
                            token.current,
                        );
                        socket?.send(binMsgIntoBytes(msg));
                    },
                    DOWN: () => {
                        const msg = swipeInputMsg(
                            "down",
                            ctx.getTickN(),
                            token.current,
                        );
                        socket?.send(binMsgIntoBytes(msg));
                    },
                    LEFT: () => {
                        const msg = swipeInputMsg(
                            "left",
                            ctx.getTickN(),
                            token.current,
                        );
                        socket?.send(binMsgIntoBytes(msg));
                    },
                })}
            />
            <BackButton />
        </View>
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

type SwipeCallbacks = {
    UP: () => void;
    RIGHT: () => void;
    DOWN: () => void;
    LEFT: () => void;
};

function swipeGestures(
    ctx: GameContextApi,
    callbacks: SwipeCallbacks,
): ComposedGesture {
    const gesUp = swipe("UP", callbacks);
    const gesRight = swipe("RIGHT", callbacks);
    const gesDown = swipe("DOWN", callbacks);
    const gesLeft = swipe("LEFT", callbacks);

    const gesUpRight = diagonalSwipe(ctx, "UP", "RIGHT", callbacks);
    const gesUpLeft = diagonalSwipe(ctx, "UP", "LEFT", callbacks);
    const gesDownRight = diagonalSwipe(ctx, "DOWN", "RIGHT", callbacks);
    const gesDownLeft = diagonalSwipe(ctx, "DOWN", "LEFT", callbacks);

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
    ctx: GameContextApi,
    dir1: keyof typeof Directions,
    dir2: keyof typeof Directions,
    callbacks: SwipeCallbacks,
): FlingGesture {
    const gesture = Gesture.Fling();
    gesture.config.direction = Directions[dir1] | Directions[dir2];
    gesture.onEnd(() => {
        if (ctx.getDirection(ctx.me()) === dir1) {
            callbacks[dir2]();
        } else {
            callbacks[dir1]();
        }
    });

    return gesture;
}
