import { Coordinate } from "@/src/binary/coordinate";
import { Image, RoundedRect, useImage } from "@shopify/react-native-skia";
import { gridPosToPixels, gridCellSize } from "@/src/scaling";
import { globalData } from "@/src/stores/globalStore";
import { colors } from "@/src/colors";

export type FoodProperties = {
    playerId: number;
    coord: Coordinate | undefined;
    layout: { width: number };
};

export function Food(props: FoodProperties) {
    const sprite = useImage(require("@/assets/game/apple.png"));

    if (props.coord === undefined) {
        return null;
    }

    const canvasWidth = props.layout.width;
    const size = gridCellSize(canvasWidth);
    const xPos = gridPosToPixels(props.coord.x, canvasWidth);
    const yPos = gridPosToPixels(props.coord.y, canvasWidth);

    return (
        <>
            {props.playerId === globalData.me() && (
                <RoundedRect
                    r={2}
                    color={colors.playerHighlight}
                    width={size}
                    height={size}
                    x={xPos}
                    y={yPos}
                />
            )}
            <Image
                image={sprite}
                fit="cover"
                width={size}
                height={size}
                x={xPos}
                y={yPos}
            />
        </>
    );
}
