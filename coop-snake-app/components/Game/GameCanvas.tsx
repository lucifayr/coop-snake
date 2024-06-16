import { GameEntities } from "@/app/(tabs)/game";
import { colors } from "@/src/colors";
import { globalData } from "@/src/stores/globalStore";
import { Canvas, Line } from "@shopify/react-native-skia";
import { ReactElement } from "react";
import { ScaledSize } from "react-native";

import { DefaultRenderer } from "react-native-game-engine";

export function GameCanvas(
    entities: GameEntities,
    screen: ScaledSize,
    layout: { width: number },
) {
    // Using as any to match the source code of this call in GameEngine
    // https://github.com/bberak/react-native-game-engine/blob/01d0827b5d5989cc559dec07d8fdad580bece494/src/GameEngine.js#L173
    // The types seem to be incorrect for some reason so we can't just use
    // DefaultRendere as is
    const renderer = DefaultRenderer as any;

    const lines = globalData.hasDebugFlag("show-grid-lines")
        ? gridLines(globalData.getBoardSize(), layout?.width)
        : undefined;

    return (
        <Canvas style={{ width: "100%", height: "100%" }}>
            {lines}
            {renderer(entities?.players, screen, layout)}
            {renderer(entities?.foods, screen, layout)}
        </Canvas>
    );
}

function gridLines(
    boardSize: number,
    canvasWidthPx: number | undefined,
): ReactElement[] | undefined {
    if (!canvasWidthPx) {
        return undefined;
    }

    const hlines = new Array(boardSize - 1).fill(0).map((_, idx) => {
        const x1 = 0;
        const x2 = canvasWidthPx;

        const yP = (idx + 1) / boardSize;
        const y1 = yP * canvasWidthPx;
        const y2 = yP * canvasWidthPx;

        return (
            <Line
                key={idx}
                color={colors.gameBorders}
                p1={{ x: x1, y: y1 }}
                p2={{ x: x2, y: y2 }}
            />
        );
    });

    const vlines = new Array(boardSize - 1).fill(0).map((_, idx) => {
        const xP = (idx + 1) / boardSize;
        const x1 = xP * canvasWidthPx;
        const x2 = xP * canvasWidthPx;

        const y1 = 0;
        const y2 = canvasWidthPx;

        return (
            <Line
                key={idx + boardSize}
                color={colors.gameBorders}
                p1={{ x: x1, y: y1 }}
                p2={{ x: x2, y: y2 }}
            />
        );
    });

    return [...hlines, ...vlines];
}
