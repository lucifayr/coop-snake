import { BackButton } from "@/components/Back";
import { AppButton } from "@/components/Button";
import { AppTextInput } from "@/components/TextInput";
import { colors } from "@/src/colors";
import { SessionConfig, newSession } from "@/src/sessionConfig";
import Slider from "@react-native-community/slider";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

type Config = {
    teamName: string;
    playerCount: number;
    boardSize: number;
    snakeSize: number;
};

const configRules = {
    teamName: {
        minLen: 1,
        maxLen: 255,
    },
    playerCount: {
        minValue: 2,
        maxValue: 8,
    },
    boardSize: {
        minValue: 16,
        maxValue: 64,
    },
    snakeSize: {
        minValue: 3,
        maxValue: 16,
    },
} as const satisfies { [key in keyof Config]: any };

export default function NewSessionScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<FieldError | undefined>(undefined);
    const [teamName, setTeamName] = useState("");
    const [playerCount, setPlayerCount] = useState(2);
    const [boardSize, setBoardSize] = useState(24);
    const [snakeSize, setSnakeSize] = useState(3);

    const onSubmit = async () => {
        if (loading) return;

        const error = validateConfig({
            teamName,
            playerCount,
            boardSize,
            snakeSize,
        });

        setError(error);
        if (error !== undefined) return;

        setLoading(true);

        const config: SessionConfig = {
            teamName,
            playerCount: Number.isNaN(playerCount) ? undefined : playerCount,
            boardSize: Number.isNaN(boardSize) ? undefined : boardSize,
            initialSnakeSize: Number.isNaN(snakeSize) ? undefined : snakeSize,
        };

        const key = await newSession(config).finally(() => setLoading(false));

        if (key) {
            router.replace({ pathname: "/game", params: { sessionKey: key } });
        } else {
            Alert.alert("Failed to create session");
        }
    };

    return (
        <KeyboardAwareScrollView contentContainerStyle={styles.container}>
            <View
                style={{
                    padding: 48,
                    gap: 16,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <BackButton />

                <Text style={styles.header}>Create Session</Text>

                <View style={[styles.containerChild, { paddingBottom: 32 }]}>
                    <AppTextInput
                        placeholder="Team name..."
                        maxLength={configRules.teamName.maxLen}
                        onChangeText={(text) => setTeamName(text)}
                    />
                </View>
                <View style={styles.containerChild}>
                    <Text style={{ color: colors.textLight, fontSize: 16 }}>
                        Board Size : {boardSize.toString().padStart(3)}
                    </Text>
                    <Slider
                        style={styles.slider}
                        value={boardSize}
                        onValueChange={(value) => {
                            setBoardSize(value);
                        }}
                        step={1}
                        minimumValue={configRules.boardSize.minValue}
                        maximumValue={configRules.boardSize.maxValue}
                        thumbTintColor={colors.accent}
                        minimumTrackTintColor={colors.accent}
                        maximumTrackTintColor={colors.bgLight}
                    />
                </View>

                <View style={styles.containerChild}>
                    <Text style={{ color: colors.textLight, fontSize: 16 }}>
                        Player count : {playerCount.toString().padStart(3)}
                    </Text>
                    <Slider
                        style={styles.slider}
                        value={playerCount}
                        onValueChange={(value) => {
                            setPlayerCount(value);
                        }}
                        step={1}
                        minimumValue={configRules.playerCount.minValue}
                        maximumValue={configRules.playerCount.maxValue}
                        thumbTintColor={colors.accent}
                        minimumTrackTintColor={colors.accent}
                        maximumTrackTintColor={colors.bgLight}
                    />
                </View>

                <View style={styles.containerChild}>
                    <Text style={{ color: colors.textLight, fontSize: 16 }}>
                        Snake size : {snakeSize.toString().padStart(3)}
                    </Text>
                    <Slider
                        style={styles.slider}
                        value={snakeSize}
                        onValueChange={(value) => setSnakeSize(value)}
                        step={1}
                        minimumValue={configRules.snakeSize.minValue}
                        maximumValue={configRules.snakeSize.maxValue}
                        thumbTintColor={colors.accent}
                        minimumTrackTintColor={colors.accent}
                        maximumTrackTintColor={colors.bgLight}
                    />
                </View>
                <AppButton text="Submit" onClick={onSubmit} />
                <FieldErrorView error={error} />
            </View>
        </KeyboardAwareScrollView>
    );
}

function FieldErrorView({ error }: { error: FieldError | undefined }) {
    let inner = null;
    if (error) {
        inner = (
            <Text
                style={{
                    color: colors.deny,
                    width: "100%",
                    fontSize: 16,
                    textAlign: "center",
                    fontWeight: "bold",
                }}
            >
                {fieldDisplayName(error.field)} : {kindDisplayName(error.kind)}
            </Text>
        );
    }

    return <View style={{ height: 48, width: "100%" }}>{inner}</View>;
}

function kindDisplayName(kind: FieldErrorKind): string {
    switch (kind) {
        case "minValue":
            return "Value too small";
        case "maxValue":
            return "Value too large";
        case "minLen":
            return "Too short";
        case "maxLen":
            return "Too long";
    }
}

function fieldDisplayName(field: FieldWithError): string {
    switch (field) {
        case "teamName":
            return "Team name";
        case "playerCount":
            return "Player count";
        case "boardSize":
            return "Board size";
        case "snakeSize":
            return "Snake size";
    }
}

type FieldWithError = keyof Config;
type FieldErrorKind = "minValue" | "maxValue" | "minLen" | "maxLen";
type FieldError = { field: FieldWithError; kind: FieldErrorKind };

function validateConfig(config: Config): FieldError | undefined {
    if (config.teamName.length < configRules.teamName.minLen) {
        return { field: "teamName", kind: "minLen" };
    }
    if (config.teamName.length > configRules.teamName.maxLen) {
        return { field: "teamName", kind: "maxLen" };
    }

    if (config.boardSize < configRules.boardSize.minValue) {
        return { field: "boardSize", kind: "minValue" };
    }
    if (config.boardSize > configRules.boardSize.maxValue) {
        return { field: "boardSize", kind: "maxValue" };
    }

    if (config.playerCount < configRules.playerCount.minValue) {
        return { field: "playerCount", kind: "minValue" };
    }
    if (config.playerCount > configRules.playerCount.maxValue) {
        return { field: "playerCount", kind: "maxValue" };
    }

    if (config.snakeSize < configRules.snakeSize.minValue) {
        return { field: "snakeSize", kind: "minValue" };
    }
    if (config.snakeSize > configRules.snakeSize.maxValue) {
        return { field: "snakeSize", kind: "maxValue" };
    }

    return undefined;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: colors.bg,
    },
    containerChild: {
        alignItems: "center",
        width: "100%",
        maxWidth: 500,
    },
    header: {
        color: colors.textLight,
        fontSize: 32,
        paddingBottom: 48,
        fontWeight: "bold",
    },
    slider: { width: "100%", height: 40 },
});
