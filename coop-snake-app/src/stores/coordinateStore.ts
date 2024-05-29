import { create } from "zustand";
import { Player } from "../binary/player";
import { Coordinate } from "../binary/coordinate";

export type CoordinateState = {
    player1: Coordinate[];
    player2: Coordinate[];
    updatePlayerCoords: (player: Player, coords: Coordinate[]) => void;
};

export const useCoordinateStore = create<CoordinateState>((set) => ({
    player1: [],
    player2: [],
    updatePlayerCoords: (player: Player, coords: Coordinate[]) => {
        set((_) => {
            switch (player) {
                case "Player1":
                    return { player1: coords };
                case "Player2":
                    return { player2: coords };
            }
        });
    },
}));
