import { AppButton } from "@/components/Button";
import { AppTextInput } from "@/components/TextInput";
import { colors } from "@/src/colors";
import { useHeaderHeight } from "@react-navigation/elements";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Modal, StyleSheet, View } from "react-native";

const text = "Snake along";
const animationDuration = 500;

export default function HomeScreen() {
    const headerHeight = useHeaderHeight();
    const router = useRouter();

    const sessionKey = useRef("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const handleModal = () => setIsModalVisible(() => !isModalVisible);

    const animatedValues = useRef(
        Array.from(
            { length: text.length },
            () => new Animated.ValueXY({ x: 0, y: 0 }),
        ),
    ).current;

    useEffect(() => {
        const createAnimation = (
            animatedValue: Animated.ValueXY,
            delay: number,
        ) =>
            Animated.sequence([
                Animated.timing(animatedValue, {
                    toValue: { x: 30, y: 0 },
                    duration: animationDuration,
                    delay,
                    useNativeDriver: true,
                }),
                Animated.timing(animatedValue, {
                    toValue: { x: 30, y: 30 },
                    duration: animationDuration,
                    useNativeDriver: true,
                }),
                Animated.timing(animatedValue, {
                    toValue: { x: 0, y: 30 },
                    duration: animationDuration,
                    useNativeDriver: true,
                }),
                Animated.timing(animatedValue, {
                    toValue: { x: 0, y: 0 },
                    duration: animationDuration,
                    useNativeDriver: true,
                }),
            ]);

        const animations = animatedValues.map((animatedValue, index) =>
            createAnimation(animatedValue, index * 100),
        );

        Animated.loop(Animated.stagger(100, animations)).start();
    }, [animatedValues]);

    return (
        <View style={{ top: -headerHeight ?? 0, flex: 1 }}>
            <View style={styles.containerOuter}>
                <View style={styles.animatedTextContainer}>
                    {text.split("").map((char, index) => (
                        <Animated.Text
                            key={index}
                            style={[
                                styles.animatedText,
                                {
                                    transform:
                                        animatedValues[
                                            index
                                        ].getTranslateTransform(),
                                },
                            ]}
                        >
                            {char}
                        </Animated.Text>
                    ))}
                </View>

                <View style={styles.containerInner}>
                    <AppButton
                        onClick={() => router.navigate("/new-session")}
                        text="Create new Game"
                    />
                    <AppButton
                        onClick={() => setIsModalVisible(true)}
                        text="Join Game"
                    />
                    <AppButton
                        onClick={() => router.navigate("/highscores")}
                        text="View High scores"
                    />
                </View>
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => {
                    setIsModalVisible(!isModalVisible);
                }}
            >
                <View style={styles.modalView}>
                    <AppTextInput
                        placeholder="000000"
                        maxLength={6}
                        onChangeText={(text) => {
                            sessionKey.current = text;
                        }}
                    />
                    <AppButton
                        onClick={() => {
                            setIsModalVisible(false);
                            router.replace({
                                pathname: "/game",
                                params: { sessionKey: sessionKey.current },
                            });
                        }}
                        text="Join"
                    ></AppButton>
                    <AppButton
                        text="Close"
                        color={colors.deny}
                        onClick={handleModal}
                    />
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    containerOuter: {
        flex: 1,
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 80,
        backgroundColor: colors.bg,
    },
    containerInner: {
        gap: 20,
    },
    modalView: {
        maxWidth: 500,
        top: "50%",
        transform: [{ translateY: -50 }],
        marginHorizontal: "auto",
        backgroundColor: colors.bgDark,
        borderRadius: 20,
        padding: 35,
        gap: 20,
    },
    animatedTextContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
    },
    animatedText: {
        color: colors.textLight,
        fontWeight: "bold",
        fontSize: 48,
    },
});
