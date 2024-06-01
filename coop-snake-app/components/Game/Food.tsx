import { assert } from "@/src/assert";
import { Coordinate } from "@/src/binary/coordinate";
import { Rect } from "@shopify/react-native-skia";
import { PLAYERS, Player } from "@/src/binary/player";
import { gridPosToPixels, gridCellSize } from "@/src/scaling";
import { Component } from "react";

export type FoodProperties = {
    playerId: Player;
    coord: Coordinate | undefined;
    layout: { width: number };
};

export class Food extends Component<FoodProperties> {
    constructor(props: FoodProperties) {
        super(props);

        assert(
            Object.keys(PLAYERS).includes(props.playerId),
            `props.playerId should be a player enum. Received ${props.playerId}`,
        );
    }

    render() {
        if (this.props.coord === undefined) {
            return null;
        }

        const canvasWidth = this.props.layout.width;
        const size = gridCellSize(canvasWidth);
        const color = foodColor(this.props.playerId);
        const xPos = gridPosToPixels(this.props.coord.x, canvasWidth);
        const yPos = gridPosToPixels(this.props.coord.y, canvasWidth);

        return (
            <Rect color={color} width={size} height={size} x={xPos} y={yPos} />
        );
    }
}

function foodColor(player: Player): string {
    switch (player) {
        case "Player1":
            return "#ff0000";
        case "Player2":
            return "#ff00ff";
    }
}
