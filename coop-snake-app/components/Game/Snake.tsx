import { assert } from "@/utils/assert";
import { Coordinate } from "@/utils/binary/coordinate";
import { Player } from "@/utils/binary/player";
import { pixelPosToSizeIndependent, snakeSegemntSize } from "@/utils/scaling";
import { Component } from "react";
import { View, StyleSheet, Dimensions } from "react-native";

export type SnakeProperties = {
  playerId: Player;
  coords: Coordinate[];
};

export class Snake extends Component<SnakeProperties> {
  constructor(props: SnakeProperties) {
    super(props);

    assert(
      Array.isArray(props.coords),
      `props.coords should be an array of coordinates. Received ${props.coords}`,
    );
    assert(
      typeof props.playerId === "string",
      `props.playerId should be a player enum. Received ${props.playerId}`,
    );
  }

  render() {
    const xPosPercentage = pixelPosToSizeIndependent(
      this.props.coords[0]?.x ?? 0,
    );

    const yPosPercentage = pixelPosToSizeIndependent(
      this.props.coords[0]?.y ?? 0,
    );

    const size = snakeSegemntSize();
    return (
      <View
        style={[
          styles.segment,
          {
            left: `${xPosPercentage}%`,
            top: `${yPosPercentage}%`,
            height: `${size}%`,
            width: `${size}%`,
            backgroundColor: playerColor(this.props.playerId),
          },
        ]}
      ></View>
    );
  }
}

function playerColor(player: Player): string {
  switch (player) {
    case "Player1":
      return "#0000ff";
    case "Player2":
      return "#00ff00";
  }
}

const styles = StyleSheet.create({
  segment: {
    position: "absolute",
  },
});
