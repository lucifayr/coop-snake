import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { SessionConfig, newSession } from "@/src/sessionConfig";
import Button from "@/components/Button";

type Input = {
    teamName: "";
    playerCount?: string;
    boardSize?: string;
    initialSnakeSize?: string;
};

export default function NewSessionScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // TODO: form validation
    const { control, handleSubmit } = useForm<Input>({
        defaultValues: {
            teamName: "",
            playerCount: "2",
            boardSize: "32",
            initialSnakeSize: "3",
        },
    });

    const onSubmit: SubmitHandler<Input> = async (data) => {
        if (loading) {
            return;
        }

        setLoading(true);

        const playerCount = parseInt(data.playerCount ?? "");
        const boardSize = parseInt(data.boardSize ?? "");
        const initialSnakeSize = parseInt(data.initialSnakeSize ?? "");

        const config: SessionConfig = {
            teamName: data.teamName,
            playerCount: Number.isNaN(playerCount) ? undefined : playerCount,
            boardSize: Number.isNaN(boardSize) ? undefined : boardSize,
            initialSnakeSize: Number.isNaN(initialSnakeSize)
                ? undefined
                : initialSnakeSize,
        };

        const key = await newSession(config);

        setLoading(false);

        if (key) {
            router.replace({ pathname: "/game", params: { sessionKey: key } });
        } else {
            Alert.alert("Failed to create session");
        }
    };

    return (
        <KeyboardAwareScrollView contentContainerStyle={styles.container}>
            <View>
                <Controller
                    control={control}
                    rules={{
                        minLength: 1,
                        maxLength: 255,
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <View style={styles.inputContainer}>
                            <Text>Team name</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="name..."
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                            />
                        </View>
                    )}
                    name="teamName"
                />
                <Controller
                    control={control}
                    rules={{
                        maxLength: 3,
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <View style={styles.inputContainer}>
                            <Text>Player count</Text>
                            <TextInput
                                style={styles.input}
                                keyboardType="numeric"
                                placeholder="count..."
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                            />
                        </View>
                    )}
                    name="playerCount"
                />

                <Controller
                    control={control}
                    rules={{
                        maxLength: 3,
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <View style={styles.inputContainer}>
                            <Text>Board size</Text>
                            <TextInput
                                style={styles.input}
                                keyboardType="numeric"
                                placeholder="size..."
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                            />
                        </View>
                    )}
                    name="boardSize"
                />

                <Controller
                    control={control}
                    rules={{
                        maxLength: 3,
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <View style={styles.inputContainer}>
                            <Text>Snake size</Text>
                            <TextInput
                                style={styles.input}
                                keyboardType="numeric"
                                placeholder="size..."
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                            />
                        </View>
                    )}
                    name="initialSnakeSize"
                />

                <Button text="Submit" onClick={handleSubmit(onSubmit)} />
            </View>
        </KeyboardAwareScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#EBAB9D",
        padding: 20,
    },
    inputContainer: {
        width: "100%",
        padding: 12,
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
});
