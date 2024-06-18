import { WithSkiaWeb } from "@shopify/react-native-skia/lib/module/web";
import { LoadingSkia } from "./LoadingSkia";

export default function GameScreen() {
    return (
        <WithSkiaWeb
            // @ts-ignore
            getComponent={() => import("./GameScreenInteractive")}
            fallback={<LoadingSkia />}
        />
    );
}
