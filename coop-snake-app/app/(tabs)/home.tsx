import { AppButton } from "@/components/Button";
import { AppTextInput } from "@/components/TextInput";
import { colors } from "@/src/colors";
import { useHeaderHeight } from "@react-navigation/elements";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
    ImageBackground,
    Modal,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from "react-native";

export default function HomeScreen() {
    const headerHeight = useHeaderHeight();
    const router = useRouter();

    const sessionKey = useRef("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const handleModal = () => setIsModalVisible(() => !isModalVisible);

    return (
        <View style={{ top: -headerHeight ?? 0, flex: 1 }}>
            <StatusBar backgroundColor={colors.bgDark} translucent />

            <View style={styles.containerOuter}>
                <Text
                    style={{
                        color: colors.textLight,
                        fontWeight: "bold",
                        fontSize: 48,
                    }}
                >
                    Snake along
                </Text>

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
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 24,
        backgroundColor: colors.bg,
    },
    containerInner: {
        flex: 1,
        gap: 20,
        paddingBottom: 40,
        justifyContent: "flex-end",
        alignItems: "center",
    },
    centeredView: {
        top: 0,
        bottom: 0,
        left: 0,
    },
    modalView: {
        top: "50%",
        transform: [{ translateY: -50 }],
        margin: 20,
        backgroundColor: colors.bgDark,
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        display: "flex",
        flexDirection: "column",
        gap: 20,
    },
});
