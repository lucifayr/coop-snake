import { assert } from "@/src/assert";
import { Coordinate } from "@/src/binary/coordinate";
import { Group, Rect } from "@shopify/react-native-skia";
import { PLAYERS, Player } from "@/src/binary/player";
import { gridPosToPixels, gridCellSize } from "@/src/scaling";
import { Component } from "react";

export type SnakeProperties = {
    playerId: Player;
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
        assert(
            Object.keys(PLAYERS).includes(props.playerId),
            `props.playerId should be a player enum. Received ${props.playerId}`,
        );
    }

    render() {
        const canvasWidth = this.props.layout.width;
        const segments = this.props.coords.map((coord, idx) => {
            const xPos = gridPosToPixels(coord.x, canvasWidth);
            const yPos = gridPosToPixels(coord.y, canvasWidth);

            const size = gridCellSize(canvasWidth);
            const color = playerColor(this.props.playerId, idx === 0);
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

function playerColor(player: Player, isHead: boolean): string {
    switch (player) {
        case "Player1":
            if (isHead) {
                return "#ffff00";
            }
            return "#0000ff";
        case "Player2":
            if (isHead) {
                return "#00ffff";
            }
            return "#00ff00";
    }
}
