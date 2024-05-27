import { GameBinaryMessage } from "./binary/gameBinaryMessage";
import { playerCoordsFromMsg } from "./playerCoords";

describe("playerCoords", () => {
    it("should parse a single coordinate point correctly", () => {
        const data = Uint8Array.of(
            ...[
                // Player Identifier
                1,
                // Coordinate Point 1
                0, 0, 0, 42, 0, 0, 0, 24,
            ],
        );
        const msg: GameBinaryMessage = {
            version: 1,
            messageType: "PlayerPosition",
            dataLenght: data.length,
            data,
        };

        const output = playerCoordsFromMsg(msg);
        expect(output.player).toBe("Player1");
        expect(output.coords).toEqual([{ x: 42, y: 24 }]);
    });

    it("should parse a series of coordinates correctly", () => {
        const data = Uint8Array.of(
            ...[
                // Player Identifier
                1,
                // Coordinate Point 1
                0, 0, 0, 42, 0, 0, 0, 24,
                // Coordinate Point 2
                0, 0, 2, 12, 0, 0, 0, 0,
                // Coordinate Point 3
                0, 0, 0, 24, 0, 0, 1, 0,
            ],
        );
        const msg: GameBinaryMessage = {
            version: 1,
            messageType: "PlayerPosition",
            dataLenght: data.length,
            data,
        };

        const output = playerCoordsFromMsg(msg);
        expect(output.player).toBe("Player1");
        expect(output.coords).toEqual([
            { x: 42, y: 24 },
            { x: 524, y: 0 },
            { x: 24, y: 256 },
        ]);
    });

    it("should throw because of having to little data", () => {
        const data = Uint8Array.of(
            ...[
                // Player Identifier
                1,
                // Coordinate Point 1
                0, 0, 0, 42, 0,
            ],
        );
        const msg: GameBinaryMessage = {
            version: 1,
            messageType: "PlayerPosition",
            dataLenght: data.length,
            data,
        };

        expect(() => playerCoordsFromMsg(msg)).toThrow(/ASSERTION FAILED/);
    });
    it("should throw  because of an invalid `messageType`", () => {
        const data = Uint8Array.of(
            ...[
                // Player Identifier
                1,
            ],
        );
        const msg: GameBinaryMessage = {
            version: 1,
            messageType: "PlayerInput",
            dataLenght: data.length,
            data,
        };

        expect(() => playerCoordsFromMsg(msg)).toThrow(/ASSERTION FAILED/);
    });
});
