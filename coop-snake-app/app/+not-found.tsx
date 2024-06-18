import { colors } from "@/src/colors";
import { Link, Stack } from "expo-router";
import { StatusBar, StyleSheet, Text, View } from "react-native";

export default function NotFoundScreen() {
    return (
        <>
            <Stack.Screen options={{ title: "Oops!" }} />
            <View style={styles.container}>
                <StatusBar backgroundColor={colors.bgDark} />

                <Text style={styles.title}>This screen doesn't exist.</Text>
                <Link href="/home" style={styles.link}>
                    <Text style={styles.linkText}>Go to home screen!</Text>
                </Link>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        backgroundColor: colors.bg,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: colors.textLight,
    },
    link: {
        marginTop: 15,
        paddingVertical: 15,
    },
    linkText: {
        fontSize: 18,
        fontWeight: "semibold",
        color: colors.accent,
    },
});
