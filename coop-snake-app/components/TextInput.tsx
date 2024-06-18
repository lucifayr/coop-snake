import { colors } from "@/src/colors";
import { useState } from "react";
import { StyleSheet, TextInput } from "react-native";

export function AppTextInput({
    onChangeText,
    maxLength,
    placeholder,
    isNumber,
}: {
    onChangeText: (text: string) => void;
    maxLength?: number;
    placeholder?: string;
    isNumber?: boolean;
}) {
    const [boderColor, setBorderColor] = useState<string>(colors.bgLight);

    return (
        <TextInput
            style={[styles.input, { borderColor: boderColor }]}
            maxLength={maxLength}
            placeholderTextColor={colors.textGray}
            placeholder={placeholder}
            keyboardType={isNumber ? "number-pad" : "default"}
            onFocus={() => {
                setBorderColor(colors.accent);
            }}
            onBlur={() => {
                setBorderColor(colors.bgLight);
            }}
            onChangeText={(text) => {
                if (isNumber && Number.isNaN(parseInt(text))) {
                    return;
                }

                onChangeText(text);
            }}
        ></TextInput>
    );
}

const styles = StyleSheet.create({
    input: {
        textAlign: "center",
        padding: 8,
        minWidth: 300,
        width: "100%",
        justifyContent: "center",
        color: colors.textLight,
        fontSize: 20,
        borderBottomWidth: 1,
    },
});
