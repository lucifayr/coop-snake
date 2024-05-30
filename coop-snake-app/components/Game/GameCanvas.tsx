import { GameEntities } from "@/app/(tabs)/game";
import { Canvas } from "@shopify/react-native-skia";
import { ScaledSize } from "react-native";

import { DefaultRenderer } from "react-native-game-engine";

export function GameCanvas(
    entities: GameEntities,
    screen: ScaledSize,
    layout: any,
) {
    // Using as any to match the source code of this call in GameEngine
    // https://github.com/bberak/react-native-game-engine/blob/01d0827b5d5989cc559dec07d8fdad580bece494/src/GameEngine.js#L173
    // The types seem to be incorrect for some reason so we can't just use
    // DefaultRendere as is
    const renderer = DefaultRenderer as any;
    return (
        <Canvas style={{ width: "100%", height: "100%" }}>
            {renderer(entities, screen, layout)}
        </Canvas>
    );
}
