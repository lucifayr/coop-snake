import { assert } from "../assert";
import { bytesToUint32 } from "./utils";

export type Coordinate = {
  x: number;
  y: number;
};

export const COORDINATE_BYTE_WIDTH = 8;

export function coordFromBytes(bytes: Uint8Array): Coordinate {
  assert(
    bytes.length === COORDINATE_BYTE_WIDTH,
    `Expected ${COORDINATE_BYTE_WIDTH} bytes of data for coordinate. Received bytes ${bytes}`,
  );

  const x = bytesToUint32(bytes.subarray(0, 4));
  const y = bytesToUint32(bytes.subarray(4, 8));

  return { x, y };
}
