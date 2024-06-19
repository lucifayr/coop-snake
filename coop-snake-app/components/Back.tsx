import { colors } from "@/src/colors";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, Text } from "react-native";

export function BackButton() {
    return (
        <Pressable
            style={{
                display: "flex",
                flexWrap: "nowrap",
                flexDirection: "row",
                marginBottom: 10,
                alignItems: "center",
                width: "100%",
            }}
            onPress={() => router.replace("/home")}
        >
            <AntDesign name="caretleft" size={24} color={colors.textLight} />
            <Text style={{ color: "white", fontSize: 20 }}>Back</Text>
        </Pressable>
    );
}
