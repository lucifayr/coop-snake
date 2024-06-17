import { Text } from "react-native";
import React, { Suspense } from "react";

import { LoadSkiaWeb } from "@shopify/react-native-skia/lib/module/web";
import { GameScreenInteractive } from "./GameScreenInteractive";
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
            <GameScreenInteractive />
        </Suspense>
    );
}
