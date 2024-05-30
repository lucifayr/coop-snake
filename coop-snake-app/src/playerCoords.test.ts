import { GameBinaryMessage } from "./binary/gameBinaryMessage";
import { playerCoordsFromMsg } from "./playerCoords";

describe("playerCoords", () => {
    it("should parse a single coordinate point correctly", () => {
        const data = new DataView(
            Uint8Array.of(
                ...[
                    // Player Identifier
                    1,
                    // Tick Number
                    0, 0, 0, 0,
                    // Coordinate Point 1
                    0, 0, 0, 42, 0, 0, 0, 24,
                ],
            ).buffer,
        );
        const msg: GameBinaryMessage = {
            version: 1,
            messageType: "PlayerPosition",
            dataLength: data.byteLength,
            data,
        };

        const output = playerCoordsFromMsg(msg);
        expect(output.player).toBe("Player1");
        expect(output.coords).toEqual([{ x: 42, y: 24 }]);
    });

    it("should parse a series of coordinates correctly", () => {
        const data = new DataView(
            Uint8Array.of(
                ...[
                    // Player Identifier
                    1,
                    // Tick Number
                    0, 0, 0, 0,
                    // Coordinate Point 1
                    0, 0, 1, 42, 0, 0, 0, 24,
                    // Coordinate Point 2
                    0, 0, 1, 42, 0, 0, 0, 25,
                    // Coordinate Point 3
                    0, 0, 1, 42, 0, 0, 0, 26,
                ],
            ).buffer,
        );
        const msg: GameBinaryMessage = {
            version: 1,
            messageType: "PlayerPosition",
            dataLength: data.byteLength,
            data,
        };

        const output = playerCoordsFromMsg(msg);
        expect(output.player).toBe("Player1");
        expect(output.coords).toEqual([
            { x: 298, y: 24 },
            { x: 298, y: 25 },
            { x: 298, y: 26 },
        ]);
    });

    it("should throw because of having to little data", () => {
        const data = new DataView(
            Uint8Array.of(
                ...[
                    // Player Identifier
                    1,
                    // Tick Number
                    0, 0, 0, 0,
                    // Coordinate Point 1
                    0, 0, 0, 42, 0,
                ],
            ).buffer,
        );
        const msg: GameBinaryMessage = {
            version: 1,
            messageType: "PlayerPosition",
            dataLength: data.byteLength,
            data,
        };

        expect(() => playerCoordsFromMsg(msg)).toThrow(/ASSERTION FAILED/);
    });
    it("should throw  because of an invalid `messageType`", () => {
        const data = new DataView(
            Uint8Array.of(
                ...[
                    // Player Identifier
                    1,
                ],
            ).buffer,
        );
        const msg: GameBinaryMessage = {
            version: 1,
            messageType: "PlayerSwipeInput",
            dataLength: data.byteLength,
            data,
        };

        expect(() => playerCoordsFromMsg(msg)).toThrow(/ASSERTION FAILED/);
    });
});
