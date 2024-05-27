import Button from "@/components/Button";
import { Hidden } from "@/components/Game/Hidden";
import { Snake, SnakeProperties } from "@/components/Game/Snake";
import { GameLoop } from "@/utils/GameLoop";
import { Coordinate } from "@/utils/binary/coordinate";
import { Player } from "@/utils/binary/player";
import { DEBUG_COORDS } from "@/utils/debug/data";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import { ReactElement, useRef, useState } from "react";
import {
  Alert,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { GameEngine } from "react-native-game-engine";

export type GameEntities = {
  player1: {
    playerId: Player;
    coords: Coordinate[];
    renderer: React.ComponentType<SnakeProperties>;
  };
  player2: {
    playerId: Player;
    coords: Coordinate[];
    renderer: React.ComponentType<SnakeProperties>;
  };
  debug: {
    data?: {
      rawCoords: Uint8Array;
      rawCoordsOffset: number;
    };
    renderer: ReactElement;
  };
};

export default function GameScreen() {
  const [running, setRunning] = useState(true);
  const [gameKey, setGameKey] = useState(0);
  const engine = useRef<any>(null);

  const isDebugActive = process.env.EXPO_PUBLIC_DEBUG === "true";

  // TODO: get websockets to work with ssl :)
  // useEffect(() => {
  //   const socket = new WebSocket(
  //     `${process.env.EXPO_WEBSOCKET_BASE_URL}/game/tmp`,
  //   );
  //   socket.binaryType = "arraybuffer";
  //
  //   socket.addEventListener("close", () => {
  //     assert(false, "TODO: handle socket close");
  //   });
  //
  //   socket.addEventListener("message", (e) => {
  //     if (e.data instanceof ArrayBuffer) {
  //       const bytes = new Uint8Array(e.data);
  //       const msg = binMsgFromBytes(bytes);
  //       if (msg.messageType === "PlayerPosition") {
  //         const playerCoords = playerCoordsFromMsg(msg);
  //       }
  //     }
  //   });
  // }, []);

  const restartGame = () => {
    setGameKey((prevKey) => prevKey + 1);
    setRunning(true);
  };

  const onEvent = (e: any) => {
    if (e.type === "game-over") {
      setRunning(false);
      Alert.alert("Game Over");
    }
  };

  // function onSwipeLeft() {
  //   engine?.current.dispatch({ type: "move-left" });
  // }
  //
  // function onSwipeRight() {
  //   engine?.current.dispatch({ type: "move-right" });
  // }
  //
  // function onSwipeUp() {
  //   engine?.current.dispatch({ type: "move-up" });
  // }
  //
  // function onSwipeDown() {
  //   engine?.current.dispatch({ type: "move-down" });
  // }

  return (
    <View style={styles.container}>
      <Pressable
        style={{
          display: "flex",
          flexWrap: "nowrap",
          flexDirection: "row",
          marginLeft: 40,
          width: "100%",
        }}
        onPress={() => router.navigate("/home")}
      >
        <AntDesign name="caretleft" size={24} color="white" />
        <Text style={{ color: "white", fontSize: 20 }}>Back</Text>
      </Pressable>

      <StatusBar backgroundColor="#EBAB9D" />

      <GameEngine
        ref={engine}
        style={styles.gamepane}
        key={gameKey}
        systems={[GameLoop]}
        entities={
          {
            player1: {
              playerId: "Player1",
              coords: [],
              renderer: Snake,
            },
            player2: {
              playerId: "Player2",
              coords: [],
              renderer: Snake,
            },
            // TODO: massive HACK, please fix asap
            debug: {
              data: isDebugActive
                ? {
                    rawCoords: DEBUG_COORDS,
                    rawCoordsOffset: 0,
                  }
                : undefined,
              renderer: <Hidden />,
            },
          } satisfies GameEntities
        }
        running={running}
        onEvent={onEvent}
      >
        <StatusBar hidden={true} />
      </GameEngine>

      <Button disabled={running} onClick={() => restartGame()} text="Restart" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EBAB9D",
    justifyContent: "space-around",
    alignItems: "center",
  },
  gamepane: {
    width: "90%",
    aspectRatio: 1,
    height: undefined,
    flex: undefined,
    backgroundColor: "#ff0000", // TODO: nice color
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 0 },
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
