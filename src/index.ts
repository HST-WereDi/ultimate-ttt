export type Mark = "X" | "O" | ".";
export type Move = {
  boardRow: number; // 0..2
  boardCol: number; // 0..2
  cellRow: number;  // 0..2
  cellCol: number;  // 0..2
};

export { SmallBoard } from "./SmallBoard.js";
export { UltimateBoard } from "./UltimateBoard.js";
