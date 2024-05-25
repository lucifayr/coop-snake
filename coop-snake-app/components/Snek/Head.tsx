import { SnakeBodyDirection, translateRotation } from "@/constants/GameConstants";
import { Component } from "react";
import { ImageBackground, StyleSheet } from "react-native";

interface HeadProperties {
  position: number[];
  size: number;
  rotation: SnakeBodyDirection;
}

class Head extends Component<HeadProperties> {
  constructor(props: HeadProperties) {
    super(props);
  }

  render() {
    const x = this.props.position[0];
    const y = this.props.position[1];
    return (
      <ImageBackground
        source={require("../../assets/game/snek-head.png")}
        style={[
          styles.head,
          { transform: [{ rotate: translateRotation(this.props?.rotation) + "deg" }], width: this.props.size, height: this.props.size, left: x * this.props.size, top: y * this.props.size },
        ]}
      />
    );
  }
}

const styles = StyleSheet.create({
  head: {
    position: "absolute",
  },
});

export { Head };
