"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SmallBoard_js_1 = require("./SmallBoard.js");
const UltimateBoard_js_1 = require("./UltimateBoard.js");
function assert(cond, msg) {
    if (!cond)
        throw new Error("ASSERT FAIL: " + msg);
}
function assertThrows(fn, msg) {
    let threw = false;
    try {
        fn();
    }
    catch {
        threw = true;
    }
    assert(threw, msg);
}
function makeDrawSmallBoard() {
    // Draw pattern (full, no winner):
    // X O X
    // X X O
    // O X O
    const b = new SmallBoard_js_1.SmallBoard();
    b.place(0, 0, "X");
    b.place(0, 1, "O");
    b.place(0, 2, "X");
    b.place(1, 0, "X");
    b.place(1, 1, "X");
    b.place(1, 2, "O");
    b.place(2, 0, "O");
    b.place(2, 1, "X");
    b.place(2, 2, "O");
    return b;
}
// --------------------
// TEST 1: constraint enforced when playable
// --------------------
{
    const ub = new UltimateBoard_js_1.UltimateBoard(undefined, { row: 0, col: 0 });
    assertThrows(() => {
        ub.applyMove({ boardRow: 1, boardCol: 1, cellRow: 0, cellCol: 0 }, "X");
    }, "Constraint should be enforced when nextBoard is playable");
    console.log("Constraint enforced test OK (threw as expected)");
}
// --------------------
// TEST 2: constraint NOT enforced when constrained board is full (draw)
// --------------------
{
    const draw = makeDrawSmallBoard();
    assert(draw.isFull(), "Draw small board should be full");
    assert(draw.getWinner() === null, "Draw small board should have no winner");
    const boards = [
        [new SmallBoard_js_1.SmallBoard(), new SmallBoard_js_1.SmallBoard(), new SmallBoard_js_1.SmallBoard()],
        [new SmallBoard_js_1.SmallBoard(), draw, new SmallBoard_js_1.SmallBoard()],
        [new SmallBoard_js_1.SmallBoard(), new SmallBoard_js_1.SmallBoard(), new SmallBoard_js_1.SmallBoard()],
    ];
    // nextBoard points to (1,1), but that board is full => should NOT constrain
    const ub = new UltimateBoard_js_1.UltimateBoard(boards, { row: 1, col: 1 });
    // If your new isBoardPlayable() includes !isFull(), this should be allowed:
    const ub2 = ub.applyMove({ boardRow: 0, boardCol: 0, cellRow: 2, cellCol: 2 }, "X");
    assert(ub2.nextBoard?.row === 2 && ub2.nextBoard?.col === 2, "nextBoard should update to (2,2)");
    console.log("Full-board constraint relaxation test OK (move allowed)");
}
console.log("All tests OK");
//# sourceMappingURL=index.js.map