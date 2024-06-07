import { Coordinate } from "@/src/binary/coordinate";
import { Rect } from "@shopify/react-native-skia";
import { gridPosToPixels, gridCellSize } from "@/src/scaling";
import { Component } from "react";
import { getFoodColor } from "@/src/colors";

export type FoodProperties = {
    playerId: number;
    coord: Coordinate | undefined;
    layout: { width: number };
};

export class Food extends Component<FoodProperties> {
    constructor(props: FoodProperties) {
        super(props);
    }

    render() {
        if (this.props.coord === undefined) {
            return null;
        }

        const canvasWidth = this.props.layout.width;
        const size = gridCellSize(canvasWidth);
        const color = getFoodColor(this.props.playerId);
        const xPos = gridPosToPixels(this.props.coord.x, canvasWidth);
        const yPos = gridPosToPixels(this.props.coord.y, canvasWidth);

        return (
            <Rect color={color} width={size} height={size} x={xPos} y={yPos} />
        );
    }
}
