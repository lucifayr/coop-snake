import { BackButton } from "@/components/Back";
import { useRefreshOnFocus } from "@/src/binary/utils";
import { colors } from "@/src/colors";
import {
    QueryClient,
    QueryClientProvider,
    useQuery,
} from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    View,
} from "react-native";

const queryClient = new QueryClient();

export default function HighscoreScreenShell() {
    return (
        <QueryClientProvider client={queryClient}>
            <HighscoreScreen />
        </QueryClientProvider>
    );
}

function HighscoreScreen() {
    const query = useQuery({ queryKey: ["scores"], queryFn: getScores });
    useRefreshOnFocus(query.refetch);

    return (
        <View style={styles.container}>
            <BackButton />

            <StatusBar backgroundColor={colors.bgDark} />
            <Text style={styles.header}>Today's High scores</Text>
            {query.isLoading && <ActivityIndicator size="large" />}
            {query.error && <Text>Failed to fetch High scores</Text>}
            {query.data && (
                <FlatList
                    data={query.data}
                    ListEmptyComponent={
                        <Text>No High scores have been set yet</Text>
                    }
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
        padding: 20,
        backgroundColor: colors.bg,
    },
    button: {
        alignSelf: "flex-start",
    },
    header: {
        fontSize: 32,
        alignSelf: "center",
        fontWeight: "bold",
        marginBottom: 20,
        color: colors.textLight,
    },
    highscore: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 10,
        marginVertical: 5,
        backgroundColor: colors.accent,
        borderRadius: 5,
    },
    highscoreText: {
        fontSize: 20,
        fontWeight: "700",
        color: colors.textDark,
    },
});
