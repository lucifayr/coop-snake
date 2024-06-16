import { assert } from "@/src/assert";
import { Coordinate } from "@/src/binary/coordinate";
import {
    Group,
    Image,
    RoundedRect,
    SkImage,
    useImage,
} from "@shopify/react-native-skia";
import { gridPosToPixels, gridCellSize } from "@/src/scaling";
import { snakeSegmentDir } from "@/src/binary/utils";
import { SnakeDirection, globalData } from "@/src/stores/globalStore";
import { colors } from "@/src/colors";

export type SnakeProperties = {
    playerId: number;
    coords: Coordinate[];
    layout: { width: number };
};

// T = Top
// R = Right
// B = Bottom
// L = Left
type SnakeSprites = {
    bodyHorizontal: SkImage | null;
    bodyVertical: SkImage | null;
    bodyBL: SkImage | null;
    bodyBR: SkImage | null;
    bodyTL: SkImage | null;
    bodyTR: SkImage | null;
    headUp: SkImage | null;
    headRight: SkImage | null;
    headDown: SkImage | null;
    headLeft: SkImage | null;
    tailUp: SkImage | null;
    tailRight: SkImage | null;
    tailDown: SkImage | null;
    tailLeft: SkImage | null;
};

// sprites taken from https://opengameart.org/content/snake-game-assets
function useSprites(): SnakeSprites {
    return {
        bodyHorizontal: useImage(require("@/assets/game/body_horizontal.png")),
        bodyVertical: useImage(require("@/assets/game/body_vertical.png")),
        bodyBL: useImage(require("@/assets/game/body_bottomleft.png")),
        bodyBR: useImage(require("@/assets/game/body_bottomright.png")),
        bodyTL: useImage(require("@/assets/game/body_topleft.png")),
        bodyTR: useImage(require("@/assets/game/body_topright.png")),
        headUp: useImage(require("@/assets/game/head_up.png")),
        headRight: useImage(require("@/assets/game/head_right.png")),
        headDown: useImage(require("@/assets/game/head_down.png")),
        headLeft: useImage(require("@/assets/game/head_left.png")),
        tailUp: useImage(require("@/assets/game/tail_up.png")),
        tailRight: useImage(require("@/assets/game/tail_right.png")),
        tailDown: useImage(require("@/assets/game/tail_down.png")),
        tailLeft: useImage(require("@/assets/game/tail_left.png")),
    };
}

function pickSegmentImage(
    segmentCurrent: Coordinate,
    segmentNext: Coordinate,
    isHead: boolean,
    isTail: boolean,
    prevDir: SnakeDirection | undefined,
): { sprite: keyof SnakeSprites; dir: SnakeDirection | undefined } {
    if (isTail) {
        switch (prevDir) {
            case "UP":
                return { sprite: "tailDown", dir: undefined };
            case "RIGHT":
                return { sprite: "tailLeft", dir: undefined };
            case "DOWN":
                return { sprite: "tailUp", dir: undefined };
            case "LEFT":
                return { sprite: "tailRight", dir: undefined };
            default:
                return { sprite: "tailLeft", dir: undefined };
        }
    }

    const dir = snakeSegmentDir(segmentCurrent, segmentNext, prevDir);
    if (isHead) {
        switch (dir) {
            case "UP":
                return { sprite: "headUp", dir };
            case "RIGHT":
                return { sprite: "headRight", dir };
            case "DOWN":
                return { sprite: "headDown", dir };
            case "LEFT":
                return { sprite: "headLeft", dir };
            default:
                return { sprite: "headRight", dir };
        }
    }

    if (prevDir === dir) {
        if (dir === "RIGHT" || dir === "LEFT") {
            return { sprite: "bodyHorizontal", dir };
        }
        if (dir === "UP" || dir === "DOWN") {
            return { sprite: "bodyVertical", dir };
        }
    }

    const isTopLeft =
        (prevDir === "LEFT" && dir === "DOWN") ||
        (prevDir === "UP" && dir === "RIGHT");
    if (isTopLeft) {
        return { sprite: "bodyTL", dir };
    }

    const isTopRight =
        (prevDir === "UP" && dir === "LEFT") ||
        (prevDir === "RIGHT" && dir === "DOWN");
    if (isTopRight) {
        return { sprite: "bodyTR", dir };
    }

    const isBottomLeft =
        (prevDir === "LEFT" && dir === "UP") ||
        (prevDir === "DOWN" && dir === "RIGHT");
    if (isBottomLeft) {
        return { sprite: "bodyBL", dir };
    }

    const isBottomRight =
        (prevDir === "RIGHT" && dir === "UP") ||
        (prevDir === "DOWN" && dir === "LEFT");
    if (isBottomRight) {
        return { sprite: "bodyBR", dir };
    }

    return { sprite: "bodyHorizontal", dir: undefined };
}

export function Snake(props: SnakeProperties) {
    const sprites = useSprites();

    assert(
        Array.isArray(props.coords),
        `props.coords should be an array of coordinates. Received ${props.coords}`,
    );

    let prevDir: SnakeDirection | undefined = undefined;
    const canvasWidth = props.layout.width;
    const segments = props.coords.map((coord, idx) => {
        const isHead = idx === 0;
        const isTail = idx === props.coords.length - 1;

        const { sprite, dir } = pickSegmentImage(
            coord,
            props.coords[idx + 1],
            isHead,
            isTail,
            prevDir,
        );
        prevDir = dir;

        const xPos = gridPosToPixels(coord.x, canvasWidth);
        const yPos = gridPosToPixels(coord.y, canvasWidth);

        const size = gridCellSize(canvasWidth);
        return (
            <>
                {props.playerId === globalData.me() && (
                    <RoundedRect
                        r={2}
                        key={idx + props.coords.length}
                        color={colors.playerHighlight}
                        width={size}
                        height={size}
                        x={xPos}
                        y={yPos}
                    />
                )}
                <Image
                    key={idx}
                    image={sprites[sprite]}
                    fit="cover"
                    width={size}
                    height={size}
                    x={xPos}
                    y={yPos}
                />
            </>
        );
    });

    return <Group key={props.playerId}>{segments}</Group>;
}
