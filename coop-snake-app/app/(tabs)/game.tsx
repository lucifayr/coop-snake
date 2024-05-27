import Button from "@/components/Button";
import { Food } from "@/components/Snek/Food";
import { Head } from "@/components/Snek/Head";
import { Tail } from "@/components/Snek/Tail";
import { GameConstants } from "@/utils/GameConstants";
import { GameLoop, randomBetween } from "@/utils/GameLoop";
import { DEBUG_COORDS } from "@/utils/debug";
import { useSwipe } from "@/utils/useSwipe";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { GameEngine } from "react-native-game-engine";

export default function GameScreen() {
  const [running, setRunning] = useState(true);
  const [gameKey, setGameKey] = useState(0);
  const engine = useRef<any>(null);

  useEffect(() => {
    if (process.env.EXPO_PUBLIC_DEBUG !== "true") {
      return;
    }

    console.log(process.env);

    const debugCoordsId = process.env.EXPO_PUBLIC_DEBUG_COORDS;
    if (debugCoordsId) {
      const debugCoords =
        DEBUG_COORDS[debugCoordsId as keyof typeof DEBUG_COORDS];
      console.log(debugCoords);
    }
  });

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

  const { onTouchStart, onTouchEnd } = useSwipe(
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    3.5,
  );

  const onEvent = (e: any) => {
    if (e.type === "game-over") {
      setRunning(false);
      Alert.alert("Game Over");
    }
  };

  function onSwipeLeft() {
    engine?.current.dispatch({ type: "move-left" });
  }

  function onSwipeRight() {
    engine?.current.dispatch({ type: "move-right" });
  }

  function onSwipeUp() {
    engine?.current.dispatch({ type: "move-up" });
  }

  function onSwipeDown() {
    engine?.current.dispatch({ type: "move-down" });
  }

  return (
    <View
      style={styles.container}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
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
        entities={{
          head: {
            position: [1, 0],
            xspeed: 1,
            yspeed: 0,
            nextMove: 10,
            updateFrequency: 10,
            size: 20,
            rotation: "RIGHT",
            renderer: <Head />,
          },
          food: {
            position: [
              randomBetween(0, GameConstants.GRID_SIZE - 1),
              randomBetween(0, GameConstants.GRID_SIZE - 1),
            ],
            size: 20,
            renderer: <Food />,
          },
          tail: {
            size: 20,
            elements: [[0, 0]],
            direction: "RIGHT",
            renderer: <Tail />,
          },
        }}
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
    height: 20 * GameConstants.GRID_SIZE,
    width: 20 * GameConstants.GRID_SIZE,
    backgroundColor: "#FBAB9D",
    borderRadius: 10,
    flex: undefined,
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
