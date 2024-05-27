import { assert } from "@/utils/assert";
import { Coordinate } from "@/utils/binary/coordinate";
import { PLAYERS, Player } from "@/utils/binary/player";
import { pixelPosToSizeIndependent, snakeSegemntSize } from "@/utils/scaling";
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
      Object.keys(PLAYERS).includes(props.playerId),
      `props.playerId should be a player enum. Received ${props.playerId}`,
    );
  }

  render() {
    const segments = this.props.coords.map((coord, idx) => {
      const xPosPercentage = pixelPosToSizeIndependent(coord.x);
      const yPosPercentage = pixelPosToSizeIndependent(coord.y);

      const size = snakeSegemntSize();
      return (
        <View
          key={idx}
          style={[
            styles.segment,
            {
              left: `${xPosPercentage}%`,
              top: `${yPosPercentage}%`,
              height: `${size}%`,
              width: `${size}%`,
              backgroundColor: playerColor(this.props.playerId, idx === 0),
            },
          ]}
        />
      );
    });

    return <View style={styles.snake}>{segments}</View>;
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
