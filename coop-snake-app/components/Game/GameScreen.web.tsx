import { Text } from "react-native";
import React, { Suspense } from "react";

import GameScreenInternal from "./GameScreenInternal";

import { LoadSkiaWeb } from "@shopify/react-native-skia/lib/module/web";
export const LazySkiaInitWeb = React.lazy(async () => {
    await LoadSkiaWeb();
    // @ts-ignore
    return import("./Dummy");
});

// TODO: update loading info text
export default function GameScreen() {
    return (
        <Suspense
            fallback={
                <Text style={{ textAlign: "center" }}>Loading Skia...</Text>
            }
        >
            <LazySkiaInitWeb />
            <GameScreenInternal />
        </Suspense>
    );
}
