"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UltimateBoard_1 = require("./UltimateBoard");
const u0 = new UltimateBoard_1.UltimateBoard();
const u1 = u0.applyMove({ boardRow: 0, boardCol: 0, cellRow: 1, cellCol: 1 }, "X");
console.log("\nNext board should be (1,1):", u1.nextBoard);
//# sourceMappingURL=index.js.map