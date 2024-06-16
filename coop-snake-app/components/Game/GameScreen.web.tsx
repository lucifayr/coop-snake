import { LoadSkiaWeb } from "@shopify/react-native-skia/lib/module/web";
import { Text } from "react-native";
import React, { Suspense } from "react";

const Screen = React.lazy(async () => {
    await LoadSkiaWeb();
    return import("./GameScreenInternal");
});

export default function GameScreen() {
    return (
        <Suspense
            fallback={
                <Text style={{ textAlign: "center" }}>Loading Skia...</Text>
            }
        >
            <Screen />
        </Suspense>
    );
}
