import Button from "@/components/Button";
import { useHeaderHeight } from "@react-navigation/elements";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
    Button as Btn,
    ImageBackground,
    Modal,
    StatusBar,
    StyleSheet,
    TextInput,
    View,
} from "react-native";

export default function HomeScreen() {
    const headerHeight = useHeaderHeight();
    const router = useRouter();

    const sessionKey = useRef("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const handleModal = () => setIsModalVisible(() => !isModalVisible);

    return (
        <ImageBackground
            style={[styles.background, { top: -headerHeight ?? 0 }]}
            source={require("@/assets/images/background.png")}
        >
            <StatusBar backgroundColor="#EBAB9D" translucent />

            <View style={styles.container}>
                <Button
                    onClick={() => router.navigate("/new-session")}
                    text="Create new Game"
                />
                <Button
                    onClick={() => setIsModalVisible(true)}
                    text="Join Game"
                />
                <Button
                    onClick={() => router.navigate("/highscores")}
                    text="View High scores"
                />
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
                    <TextInput
                        placeholder="000000"
                        maxLength={6}
                        onChangeText={(text) => {
                            sessionKey.current = text;
                        }}
                    />
                    <Button
                        onClick={() => {
                            setIsModalVisible(false);
                            router.replace({
                                pathname: "/game",
                                params: { sessionKey: sessionKey.current },
                            });
                        }}
                        text="Join"
                    ></Button>
                    <Btn title="Close" color="#ebd29d" onPress={handleModal} />
                </View>
            </Modal>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        transform: [{ rotate: "180deg" }],
    },
    container: {
        flex: 1,
        gap: 20,
        paddingBottom: 40,
        justifyContent: "flex-end",
        alignItems: "center",
        transform: [{ rotate: "180deg" }],
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
        backgroundColor: "white",
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
