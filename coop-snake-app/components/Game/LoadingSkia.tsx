import { colors } from "@/src/colors";
import { ActivityIndicator } from "react-native";
import { Text, View } from "react-native";

export function LoadingSkia() {
    return (
        <View
            style={{
                width: "100%",
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: colors.bg,
            }}
        >
            <View>
                <ActivityIndicator size="large" />
                <Text
                    style={{
                        marginTop: 24,
                        color: colors.textLight,
                        fontSize: 18,
                        fontWeight: "bold",
                    }}
                >
                    Loading Canvas
                </Text>
            </View>
        </View>
    );
}
