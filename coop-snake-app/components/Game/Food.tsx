import { assert } from "@/utils/assert";
import { PureComponent } from "react";
import { ImageBackground, StyleSheet } from "react-native";

interface FoodProperties {
  position: number[];
  size: number;
}

export class Food extends PureComponent {
  private extraProps: FoodProperties;

  constructor(props: FoodProperties) {
    super(props);

    assert(
      typeof props.size === "number",
      `props.size should be a number. Received ${props.size}`,
    );
    assert(
      Array.isArray(props.position),
      `props.position should be a tuple of numbers. Received ${props.position}`,
    );

    this.extraProps = {
      size: props.size,
      position: props.position,
    };
  }

  render() {
    const x = this.extraProps.position[0];
    const y = this.extraProps.position[1];
    return (
      <ImageBackground
        source={require("../../assets/game/apple.png")}
        style={[
          styles.apple,
          {
            left: x * this.extraProps.size,
            top: y * this.extraProps.size,
            width: this.extraProps.size,
            height: this.extraProps.size,
          },
        ]}
      />
    );
  }
}

const styles = StyleSheet.create({
  apple: {
    position: "absolute",
  },
});
