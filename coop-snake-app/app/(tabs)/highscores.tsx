import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

export default function HighscoreScreen() {
    const router = useRouter();

    const highscores = [
        { name: "Team 1", score: 100 },
        { name: "Team 3", score: 200 },
        { name: "Team 5", score: 500 },
        { name: "Team 2", score: 300 },
        { name: "Team 4", score: 400 },
    ];

    return (
        <View style={styles.container}>
            <Pressable
                style={{
                    display: "flex",
                    flexWrap: "nowrap",
                    flexDirection: "row",
                    marginBottom: 10,
                    width: "100%",
                }}
                onPress={() => router.navigate("/home")}
            >
                <AntDesign name="caretleft" size={24} color="white" />
                <Text style={{ color: "white", fontSize: 20 }}>Back</Text>
            </Pressable>

            <StatusBar backgroundColor="#EBAB9D" />
            <Text style={styles.header}>Highscores</Text>
            <FlatList
                data={highscores.sort((a, b) => b.score - a.score)}
                renderItem={({ item }) => (
                    <View style={styles.highscore}>
                        <Text style={styles.highscoreText}>{item.name}</Text>
                        <Text style={styles.highscoreText}>{item.score}</Text>
                    </View>
                )}
            ></FlatList>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#EBAB9D",
        padding: 20,
    },
    button: {
        alignSelf: "flex-start",
    },
    header: {
        fontSize: 40,
        fontWeight: "bold",
        color: "#faffee",
        marginBottom: 20,
    },
    highscore: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 10,
        marginVertical: 5,
        backgroundColor: "#faffee",
        borderRadius: 5,
    },
    highscoreText: {
        fontSize: 20,
        color: "#EBAB9D",
        fontWeight: "700",
    },
});
