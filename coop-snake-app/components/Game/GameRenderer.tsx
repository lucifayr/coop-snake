import { SnakeProperties } from "@/components/Game/Snake";
import { GameLoop } from "@/src/gameLoop";
import { COORDINATE_BYTE_WIDTH, Coordinate } from "@/src/binary/coordinate";
import { useFocusEffect } from "expo-router";
import { ReactNode, useCallback, useContext } from "react";
import { ScaledSize, StatusBar, StyleSheet, View } from "react-native";
import { GameEngine } from "react-native-game-engine";
import { playerCoordsFromMsg } from "@/src/playerCoords";
import { binMsgFromBytes } from "@/src/binary/gameBinaryMessage";
import { GameCanvas } from "@/components/Game/GameCanvas";
import { BufferState, staticBuffer } from "@/src/binary/useBuffer";
import {
    GestureDetector,
    GestureHandlerRootView,
    ComposedGesture,
} from "react-native-gesture-handler";
import { SessionInfo, parseSessionInfoMsg } from "@/src/binary/sessionInfo";
import { foodCoordFromMsg } from "@/src/foodCoords";
import { FoodProperties } from "@/components/Game/Food";
import { colors } from "@/src/colors";
import { GameContext, GameContextApi } from "@/src/context/gameContext";

export type GameEntities = {
    players: {
        [key: number]: {
            ctx: GameContextApi;
            playerId: number;
            coords: Coordinate[];
            renderer: React.ComponentType<SnakeProperties>;
        };
    };
    foods: {
        [key: number]: {
            ctx: GameContextApi;
            playerId: number;
            coord: Coordinate | undefined;
            renderer: React.ComponentType<FoodProperties>;
        };
    };
};

export function useRenderer(
    ws: WebSocket | undefined,
    onSessionInfo: (info: SessionInfo, buf: BufferState) => void,
) {
    const ctx = useContext(GameContext);

    useFocusEffect(
        useCallback(() => {
            const staticBuf = staticBuffer(
                ctx.getBoardSize() *
                    ctx.getBoardSize() *
                    COORDINATE_BYTE_WIDTH *
                    16,
            );

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
                staticBuf.writeCanonicalBytes(new DataView(data));
                const msg = binMsgFromBytes(staticBuf.view());

                if (msg.messageType === "SessionInfo") {
                    const info = parseSessionInfoMsg(msg.data);
                    onSessionInfo(info, staticBuf);
                }

                if (msg.messageType === "PlayerPosition") {
                    const playerCoords = playerCoordsFromMsg(msg);
                    ctx.setTickN(playerCoords.tickN);
                    ctx.setCoords(playerCoords.player, playerCoords.coords);
                }

                if (msg.messageType === "FoodPosition") {
                    const foodCoord = foodCoordFromMsg(msg);
                    ctx.setFood(foodCoord.player, foodCoord.coord);
                }
            };

            ws?.addEventListener("message", onMsg);
            ws?.addEventListener("error", onErr);

            return () => {
                ws?.removeEventListener("message", onMsg);
                ws?.removeEventListener("error", onErr);
            };
        }, [ws, onSessionInfo]),
    );
}

export function GameRenderer({ onSwipe }: { onSwipe: ComposedGesture }) {
    const ctx = useContext(GameContext);

    return (
        <GameScreenContainer onSwipe={onSwipe}>
            <GameEngine
                style={{ width: "100%", height: "100%" }}
                renderer={(
                    entities: GameEntities,
                    screen: ScaledSize,
                    layout: { width: number },
                ) => GameCanvas(ctx, entities, screen, layout)}
                systems={[(entities: any) => GameLoop(ctx, entities)]}
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

function initialEntities(): GameEntities {
    return {
        players: [],
        foods: [],
    };
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
        width: "90%",
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
