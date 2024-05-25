import { useState } from "react";
import { Pressable, StyleSheet, Text } from "react-native";

export default function Button(props: { text: string; onClick?: () => void; disabled?: boolean }) {
  const [buttonColor, setButtonColor] = useState("#ebd29d");

  return (
    <Pressable
      style={[{ backgroundColor: buttonColor }, styles.button, props.disabled && styles.disabled]}
      onPress={() => {
        if (props.onClick && !props.disabled) props.onClick();
      }}
      onTouchStart={() => {
        setButtonColor("#faffee");
      }}
      onTouchEnd={() => {
        setButtonColor("#ebd29d");
      }}
    >
      <Text style={styles.buttonText}>{props.text}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 300,
    borderRadius: 50,
    justifyContent: "center",
    paddingVertical: 12,
  },
  buttonText: {
    fontSize: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  disabled: {
    backgroundColor: "#faffee !important",
  },
});
