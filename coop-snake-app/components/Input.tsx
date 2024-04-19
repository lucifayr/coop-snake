import { useEffect, useState } from "react";
import { StyleSheet, TextInput } from "react-native";

export default function Input(props: { placeholder: string; onChange: (value: string) => void }) {
  const [value, setValue] = useState("");

  useEffect(() => {
    if (value.length === 3) setValue(value + "-");
  }, [value]);

  return (
    // input field
    <TextInput
      value={value}
      style={styles.input}
      placeholder={props.placeholder}
      placeholderTextColor={"#faffee"}
      onChange={(e) => setValue(e.nativeEvent.text)}
      inputMode="numeric"
      textAlign="center"
      keyboardType="number-pad"
      maxLength={7}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#ebd29d",
    width: 300,
    borderRadius: 50,
    justifyContent: "center",
    paddingVertical: 12,
    textAlign: "center",
    fontSize: 20,
  },
});
