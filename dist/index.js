"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UltimateBoard_1 = require("./UltimateBoard");
const u0 = new UltimateBoard_1.UltimateBoard();
const u1 = u0.applyMove({ boardRow: 0, boardCol: 0, cellRow: 1, cellCol: 1 }, "X");
console.log("\nNext board should be (1,1):", u1.nextBoard);
try {
    // fout: we negeren de constraint en spelen in (0,0)
    u1.applyMove({ boardRow: 0, boardCol: 0, cellRow: 0, cellCol: 0 }, "O");
    console.log("ERROR: constraint test should have thrown");
}
catch (e) {
    console.log("Constraint test OK (threw):", e.message);
}
//# sourceMappingURL=index.js.map