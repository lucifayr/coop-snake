import { colors } from "@/src/colors";
import { useState } from "react";
import { Pressable, StyleSheet, Text } from "react-native";

export function AppButton(props: {
    text: string;
    onClick: () => void;
    disabled?: boolean;
    color?: string;
}) {
    const [defaultColor, setDefaultColor] = useState<string>(
        props.color ?? colors.accent,
    );

    return (
        <Pressable
            style={[
                { backgroundColor: defaultColor },
                styles.button,
                props.disabled && styles.disabled,
            ]}
            onPress={() => {
                if (props.onClick && !props.disabled) props.onClick();
            }}
            onTouchStart={() => {
                if (!props.color) {
                    return;
                }
                setDefaultColor(colors.accentLight);
            }}
            onTouchEnd={() => {
                if (!props.color) {
                    return;
                }
                setDefaultColor(colors.accent);
            }}
        >
            <Text style={styles.buttonText}>{props.text}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        minWidth: 300,
        borderRadius: 50,
        justifyContent: "center",
        paddingVertical: 12,
    },
    buttonText: {
        fontSize: 20,
        color: colors.textDark,
        textAlign: "center",
        fontWeight: "bold",
    },
    disabled: {
        backgroundColor: colors.disabled,
    },
});
