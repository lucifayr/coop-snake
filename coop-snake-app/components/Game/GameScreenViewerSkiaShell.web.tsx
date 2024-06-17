import { WithSkiaWeb } from "@shopify/react-native-skia/lib/module/web";
import { Text } from "react-native";

export default function GameScreen() {
    return (
        <WithSkiaWeb
            // @ts-ignore
            getComponent={() => import("./GameScreenViewer")}
            fallback={<Text>Loading Skia...</Text>}
        />
    );
}
