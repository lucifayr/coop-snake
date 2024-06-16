import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import {
    useQuery,
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query";
import { useRefreshOnFocus } from "@/src/binary/utils";

const queryClient = new QueryClient();

export default function HighscoreScreenShell() {
    return (
        <QueryClientProvider client={queryClient}>
            <HighscoreScreen />
        </QueryClientProvider>
    );
}

function HighscoreScreen() {
    const router = useRouter();
    const query = useQuery({ queryKey: ["scores"], queryFn: getScores });
    useRefreshOnFocus(query.refetch);

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
            <Text style={styles.header}>Today's High Scores</Text>
            {query.isLoading && <ActivityIndicator size="large" />}
            {query.error && <Text>Failed to fetch High Scores</Text>}
            {query.data && (
                <FlatList
                    data={query.data}
                    renderItem={({ item }) => (
                        <View style={styles.highscore}>
                            <Text style={styles.highscoreText}>
                                {item.teamName}
                            </Text>
                            <Text style={styles.highscoreText}>
                                {item.score}
                            </Text>
                        </View>
                    )}
                ></FlatList>
            )}
        </View>
    );
}

async function getScores(): Promise<{ teamName: string; score: number }[]> {
    const resp = await fetch(
        `${process.env.EXPO_PUBLIC_HTTP_BASE_URL}/score/today`,
        {
            headers: {
                "Content-Type": "application/json",
            },
        },
    );

    const data = await resp.json();
    if (!Array.isArray(data)) {
        console.warn("Expected array but received", data);
        return [];
    }

    return data;
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
        fontSize: 32,
        alignSelf: "center",
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
