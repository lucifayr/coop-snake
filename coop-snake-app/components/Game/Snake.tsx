import { assert } from "@/src/assert";
import { Coordinate } from "@/src/binary/coordinate";
import { Group, Rect } from "@shopify/react-native-skia";
import { PLAYERS, Player } from "@/src/binary/player";
import { gridPosToPixels, snakeSegemntSize } from "@/src/scaling";
import { Component } from "react";
import { StyleSheet } from "react-native";

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
            const xPosPercentage = gridPosToPixels(coord.x, canvasWidth);
            const yPosPercentage = gridPosToPixels(coord.y, canvasWidth);

            const size = snakeSegemntSize(canvasWidth);
            const color = playerColor(this.props.playerId, idx === 0);
            return (
                <Rect
                    key={idx}
                    color={color}
                    width={size}
                    height={size}
                    x={xPosPercentage}
                    y={yPosPercentage}
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
                return "#ff00ff";
            }
            return "#00ff00";
    }
}

const styles = StyleSheet.create({
    snake: { width: "100%", height: "100%" },
    segment: {
        position: "absolute",
    },
});
