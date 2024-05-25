import { Component } from "react";
import { ImageBackground, StyleSheet } from "react-native";

interface FoodProperties {
  position: number[];
  size: number;
}

class Food extends Component<FoodProperties> {
  constructor(props: FoodProperties) {
    super(props);
  }

  render() {
    const x = this.props.position[0];
    const y = this.props.position[1];
    return (
      <ImageBackground
        source={require("../../assets/game/apple.png")}
        style={[styles.apple, { left: x * this.props.size, top: y * this.props.size, width: this.props.size, height: this.props.size }]}
      />
    );
  }
}

const styles = StyleSheet.create({
  apple: {
    position: "absolute",
  },
});

export { Food };
