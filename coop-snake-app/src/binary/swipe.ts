const SWIPE_INPUT_BYTES = {
    up: 0,
    right: 1,
    down: 2,
    left: 3,
} as const;

export type SwipeInputKind = keyof typeof SWIPE_INPUT_BYTES;

export function swipeInputMsg(kind: SwipeInputKind, frameTimestamp: number) {}
