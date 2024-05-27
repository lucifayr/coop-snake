import {
  GameConstants,
  SnakeBodyDirection,
  translateRotation,
} from "@/utils/GameConstants";
import { assert } from "@/utils/assert";
import { PureComponent } from "react";
import { ImageBackground, View } from "react-native";

type TailProperties = {
  size: number;
  elements: any[];
  direction: SnakeBodyDirection;
};

export class Tail extends PureComponent {
  private extraProps: TailProperties;

  constructor(props: TailProperties) {
    super(props);

    assert(
      typeof props.size === "number",
      `props.size should be a number. Received ${props.size}`,
    );
    assert(
      Array.isArray(props.elements),
      `props.elements should be a list. Received ${props.elements}`,
    );
    assert(
      typeof props.direction === "string",
      `props.direction should be a direction enum. Received ${props.direction}`,
    );

    this.extraProps = {
      size: props.size,
      elements: props.elements,
      direction: props.direction,
    };
  }

  render() {
    let tailList = this.extraProps.elements.map((el, idx) => {
      return (
        <ImageBackground
          source={require("../../assets/game/snek-body.png")}
          key={idx}
          style={{
            transform: [
              { rotate: translateRotation(this.extraProps.direction) + "deg" },
            ],
            width: this.extraProps.size,
            height: this.extraProps.size,
            position: "absolute",
            left: el[0] * this.extraProps.size,
            top: el[1] * this.extraProps.size,
          }}
        />
      );
    });

    return (
      <View
        style={{
          width: GameConstants.GRID_SIZE * this.extraProps.size,
          height: GameConstants.GRID_SIZE * this.extraProps.size,
        }}
      >
        {tailList}
      </View>
    );
  }
}
