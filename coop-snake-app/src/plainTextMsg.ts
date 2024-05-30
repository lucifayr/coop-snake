export type PlainTextMsg =
    | {
          type: "player-token";
          token: string;
      }
    | { type: "session-key"; key: string }
    | { type: "unknown" };

export function parsePlainTextMsg(msg: string): PlainTextMsg {
    const [type, value] = msg.split(":", 2);
    switch (type) {
        case "player-token":
            return { type: "player-token", token: value };
        case "session-key":
            return { type: "session-key", key: value };
        default:
            return { type: "unknown" };
    }
}
