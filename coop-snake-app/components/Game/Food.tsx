import { Coordinate } from "@/src/binary/coordinate";
import {
    ColorMatrix,
    Image,
    Shadow,
    useImage,
} from "@shopify/react-native-skia";
import { gridPosToPixels, gridCellSize } from "@/src/scaling";
import { colorMatrixGrayScale } from "@/src/colors";
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
        <Image
            image={sprite}
            fit="cover"
            width={size}
            height={size}
            x={xPos}
            y={yPos}
        >
            {props.playerId !== props.ctx.me() && (
                <ColorMatrix matrix={colorMatrixGrayScale} />
            )}
            {props.playerId === props.ctx.me() && (
                <Shadow blur={5} dx={0} dy={0} color={"#f59e0b"} />
            )}
        </Image>
    );
}
