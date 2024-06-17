import GameScreenView from "@/components/Game/GameScreenViewerSkiaShell";
import { colors } from "@/src/colors";
import { GameContextProvider } from "@/src/context/gameContext";
import { useLocalSearchParams } from "expo-router";
import { FlatList, Text, View, useWindowDimensions } from "react-native";

const cellWidth = 600;

export default function GameScreenShell() {
    const { keys } = useLocalSearchParams<{ keys: string }>();
    const sessionKeys = (keys ?? "").split(",").filter((x) => {
        return x.trim().length !== 0;
    });

    const { width } = useWindowDimensions();

    return (
        <FlatList
            style={{ backgroundColor: colors.bg }}
            ListEmptyComponent={<Text>Not viewing any sessions</Text>}
            key={width}
            numColumns={Math.trunc(width / cellWidth)}
            data={sessionKeys ?? []}
            renderItem={(key) => {
                return (
                    <View style={{ width: cellWidth, minHeight: cellWidth }}>
                        <GameContextProvider
                            sessionKey={key.item}
                            key={key.index}
                        >
                            <GameScreenView />
                        </GameContextProvider>
                    </View>
                );
            }}
        />
    );
}
