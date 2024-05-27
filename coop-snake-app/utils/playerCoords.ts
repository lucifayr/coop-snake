import { assert } from "./assert";
import {
  COORDINATE_BYTE_WIDTH,
  Coordinate,
  coordFromBytes,
} from "./binary/coordinate";
import { GameBinaryMessage } from "./binary/gameBinaryMessage";
import { PLAYER_BYTE_WIDTH, Player, playerFromByte } from "./binary/player";

export type PlayerCoordinates = {
  player: Player;
  coords: Coordinate[];
};

export function playerCoordsFromMsg(msg: GameBinaryMessage): PlayerCoordinates {
  assert(
    msg.messageType === "PlayerPosition",
    `Expected type of message to be 'PlayerPosition'. Received ${msg.messageType}.`,
  );

  const data = msg.data;

  const player = playerFromByte(msg.data.subarray(0, PLAYER_BYTE_WIDTH));

  const coordCount = Math.floor(
    (msg.dataLenght - PLAYER_BYTE_WIDTH) / COORDINATE_BYTE_WIDTH,
  );
  const coords = new Array(coordCount);

  for (
    let i = PLAYER_BYTE_WIDTH;
    i < msg.dataLenght;
    i += COORDINATE_BYTE_WIDTH
  ) {
    const idx = (i - PLAYER_BYTE_WIDTH) / COORDINATE_BYTE_WIDTH;
    const coordBytes = data.subarray(i, i + COORDINATE_BYTE_WIDTH);
    const cord = coordFromBytes(coordBytes);
    coords[idx] = cord;
  }

  return { player, coords };
}
