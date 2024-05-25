import { GameConstants, SnakeBodyDirection, translateRotation } from "@/constants/GameConstants";
import { Component } from "react";
import { ImageBackground, View } from "react-native";

interface TailProperties {
  size: number;
  elements: any[];
  direction: SnakeBodyDirection;
}

class Tail extends Component<TailProperties> {
  constructor(props: TailProperties) {
    super(props);
  }

  render() {
    let tailList = this.props.elements.map((el, idx) => {
      return (
        <ImageBackground
          source={require("../../assets/game/snek-body.png")}
          key={idx}
          style={{
            transform: [{ rotate: translateRotation(this.props?.direction) + "deg" }],
            width: this.props.size,
            height: this.props.size,
            position: "absolute",
            left: el[0] * this.props.size,
            top: el[1] * this.props.size,
          }}
        />
      );
    });

    return <View style={{ width: GameConstants.GRID_SIZE * this.props.size, height: GameConstants.GRID_SIZE * this.props.size }}>{tailList}</View>;
  }
}

export { Tail };
