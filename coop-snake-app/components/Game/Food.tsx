import { Coordinate } from "@/src/binary/coordinate";
import {
    Group,
    Image,
    RoundedRect,
    useImage,
} from "@shopify/react-native-skia";
import { gridPosToPixels, gridCellSize } from "@/src/scaling";
import { colors } from "@/src/colors";
import { GameContextApi } from "@/src/context/gameContext";

export type FoodProperties = {
    ctx: GameContextApi;
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
    const size = gridCellSize(props.ctx.getBoardSize(), canvasWidth);
    const xPos = gridPosToPixels(
        props.ctx.getBoardSize(),
        props.coord.x,
        canvasWidth,
    );
    const yPos = gridPosToPixels(
        props.ctx.getBoardSize(),
        props.coord.y,
        canvasWidth,
    );

    return (
        <Group>
            {props.playerId === props.ctx.me() && (
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
        </Group>
    );
}
