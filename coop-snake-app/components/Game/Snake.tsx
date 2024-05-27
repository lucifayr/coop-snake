import { assert } from "@/utils/assert";
import { Coordinate } from "@/utils/binary/coordinate";
import { Player } from "@/utils/binary/player";
import { pixelPosToSizeIndependent } from "@/utils/positioning";
import { Component } from "react";
import { View, StyleSheet } from "react-native";

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

    return (
      <View
        style={[
          styles.segment,
          {
            left: `${xPosPercentage}%`,
            top: `${yPosPercentage}%`,
          },
        ]}
      ></View>
    );
  }
}

const styles = StyleSheet.create({
  segment: {
    width: 24,
    height: 24,
    position: "absolute",
    backgroundColor: "#0000ff",
  },
});
