import { constKeyFromValueMap } from "./utils";

const SESSION_INFO_TYPES = {
    SessionKey: 0,
    PlayerToken: 1,
    BoardSize: 2,
    GameOver: 3,
    PlayerId: 4,
    WaitingFor: 5,
    PlayerCount: 6,
    RestartConfirmed: 7,
    RestartDenied: 8,
} as const;

const GAME_OVER_CAUSES = {
    CollisionBounds: 0,
    CollisionSelf: 1,
    CollisionOther: 2,
} as const;

export type SessionInfoType = keyof typeof SESSION_INFO_TYPES;
export type GameOverCause = keyof typeof GAME_OVER_CAUSES;

export type SessionInfo =
    | {
          type: Extract<
              SessionInfoType,
              | "SessionKey"
              | "PlayerToken"
              | "BoardSize"
              | "PlayerId"
              | "WaitingFor"
              | "PlayerCount"
          >;
          value: number;
      }
    | { type: "GameOver"; cause: GameOverCause }
    | { type: "Restart"; kind: "confirmed" | "denied" };

export function parseSessionInfoMsg(bytes: DataView): SessionInfo {
    const typeByte = bytes.getUint8(0);
    const type = constKeyFromValueMap(typeByte, SESSION_INFO_TYPES);
    if (type === "GameOver") {
        const byte = bytes.getUint8(1);
        const cause = constKeyFromValueMap(byte, GAME_OVER_CAUSES);
        return { type, cause };
    }

    if (type === "RestartConfirmed") {
        return { type: "Restart", kind: "confirmed" };
    }

    if (type === "RestartDenied") {
        return { type: "Restart", kind: "denied" };
    }

    const value = bytes.getUint32(1);
    return { value, type: type! };
}
