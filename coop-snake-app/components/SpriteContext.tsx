import { SkImage, useImage } from "@shopify/react-native-skia";
import { ReactNode, createContext } from "react";

export type Sprites = {
    snakeHead: SkImage | null;
    snakeBody: SkImage | null;
    food: SkImage | null;
};

export const SpriteContext = createContext<Sprites>({
    snakeHead: null,
    snakeBody: null,
    food: null,
});

export function SpriteContextProvider({ children }: { children: ReactNode }) {
    const snakeHead = useImage(require("@/assets/game/snake-head.png"));
    const snakeBody = useImage(require("@/assets/game/snake-body.png"));
    const food = useImage(require("@/assets/game/food.png"));

    return (
        <SpriteContext.Provider value={{ snakeHead, snakeBody, food }}>
            {children}
        </SpriteContext.Provider>
    );
}
