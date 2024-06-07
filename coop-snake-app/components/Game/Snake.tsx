import { assert } from "@/src/assert";
import { Coordinate } from "@/src/binary/coordinate";
import { Group, Rect } from "@shopify/react-native-skia";
import { gridPosToPixels, gridCellSize } from "@/src/scaling";
import { Component } from "react";
import { getPlayerColor } from "@/src/colors";

export type SnakeProperties = {
    playerId: number;
    coords: Coordinate[];
    layout: { width: number };
};

export class Snake extends Component<SnakeProperties> {
    constructor(props: SnakeProperties) {
        super(props);

        assert(
            Array.isArray(props.coords),
            `props.coords should be an array of coordinates. Received ${props.coords}`,
        );
    }

    render() {
        const canvasWidth = this.props.layout.width;
        const segments = this.props.coords.map((coord, idx) => {
            const xPos = gridPosToPixels(coord.x, canvasWidth);
            const yPos = gridPosToPixels(coord.y, canvasWidth);

            const size = gridCellSize(canvasWidth);
            const color = getPlayerColor(this.props.playerId);
            return (
                <Rect
                    key={idx}
                    color={color}
                    width={size}
                    height={size}
                    x={xPos}
                    y={yPos}
                />
            );
        });

        return <Group>{segments}</Group>;
    }
}
