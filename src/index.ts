export type Mark = "X" | "O" | ".";
export type Move = {
    boardRow: number; // 0..2
    boardCol: number; // 0..2
    cellRow: number;  // 0..2
    cellCol: number;  // 0..2
};

import { SmallBoard } from "./SmallBoard";

import { UltimateBoard } from "./UltimateBoard";

const u0 = new UltimateBoard();

const u1 = u0.applyMove(
  { boardRow: 0, boardCol: 0, cellRow: 1, cellCol: 1 },
  "X"
);

console.log("\nNext board should be (1,1):", u1.nextBoard);
