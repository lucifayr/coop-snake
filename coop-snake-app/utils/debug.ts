// TODO: make sure  this is not in the production build :)))))
export const DEBUG_COORDS = {
  coordsMoveTopLeftToBottomRight: Uint8Array.of(...[1, 2, 3, 4]),
  coordsMoveBottomRightToTopLeft: Uint8Array.of(...[4, 3, 2, 1]),
} as const;
