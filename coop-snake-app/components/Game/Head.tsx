import { SnakeBodyDirection, translateRotation } from "@/utils/GameConstants";
import { assert } from "@/utils/assert";
import { PureComponent } from "react";
import { ImageBackground, StyleSheet } from "react-native";

type HeadProperties = {
  position: number[];
  size: number;
  rotation: SnakeBodyDirection;
};

export class Head extends PureComponent {
  private extraProps: HeadProperties;

  constructor(props: HeadProperties) {
    super(props);

    assert(
      typeof props.size === "number",
      `props.size should be a number. Received ${props.size}`,
    );
    assert(
      Array.isArray(props.position),
      `props.position should be a tuple of numbers. Received ${props.position}`,
    );
    assert(
      typeof props.rotation === "string",
      `props.rotation should be a direction enum. Received ${props.rotation}`,
    );

    this.extraProps = {
      position: props.position,
      size: props.size,
      rotation: props.rotation,
    };
  }

  render() {
    const x = this.extraProps.position[0];
    const y = this.extraProps.position[1];
    return (
      <ImageBackground
        source={require("../../assets/game/snek-head.png")}
        style={[
          styles.head,
          {
            transform: [
              { rotate: translateRotation(this.extraProps.rotation) + "deg" },
            ],
            width: this.extraProps.size,
            height: this.extraProps.size,
            left: x * this.extraProps.size,
            top: y * this.extraProps.size,
          },
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
