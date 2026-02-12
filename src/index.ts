export type Mark = "X" | "O" | ".";

import { SmallBoard } from "./SmallBoard";

const b = new SmallBoard();

const w = new SmallBoard();
w.place(0, 0, "X");
w.place(0, 1, "X");
w.place(0, 2, "X");
console.log("\nWinner test board:");
console.log(w.toString());
console.log("Winner:", w.getWinner());

