"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SmallBoard_1 = require("./SmallBoard");
const b = new SmallBoard_1.SmallBoard();
const w = new SmallBoard_1.SmallBoard();
w.place(0, 0, "X");
w.place(0, 1, "X");
w.place(0, 2, "X");
console.log("\nWinner test board:");
console.log(w.toString());
console.log("Winner:", w.getWinner());
//# sourceMappingURL=index.js.map