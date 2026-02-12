"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UltimateBoard = void 0;
const SmallBoard_1 = require("./SmallBoard");
class UltimateBoard {
    boards;
    nextBoard;
    constructor(boards, nextBoard = null) {
        if (boards) {
            this.boards = boards;
        }
        else {
            this.boards = [
                [new SmallBoard_1.SmallBoard(), new SmallBoard_1.SmallBoard(), new SmallBoard_1.SmallBoard()],
                [new SmallBoard_1.SmallBoard(), new SmallBoard_1.SmallBoard(), new SmallBoard_1.SmallBoard()],
                [new SmallBoard_1.SmallBoard(), new SmallBoard_1.SmallBoard(), new SmallBoard_1.SmallBoard()],
            ];
        }
        this.nextBoard = nextBoard;
    }
    getSmallBoard(boardRow, boardCol) {
        const rowRef = this.boards[boardRow];
        if (!rowRef) {
            throw new Error("boardRow out of range");
        }
        const b = rowRef[boardCol];
        if (!b) {
            throw new Error("boardCol out of range");
        }
        return b;
    }
    applyMove(move, mark) {
        const targetBoard = this.getSmallBoard(move.boardRow, move.boardCol).clone();
        const ok = targetBoard.place(move.cellRow, move.cellCol, mark);
        if (!ok) {
            throw new Error("Illegal move: cell is not empty (or out of range)");
        }
        const newBoards = [];
        for (let r = 0; r < 3; r++) {
            const rowRef = this.boards[r];
            if (!rowRef) {
                throw new Error("Board row out of range");
            }
            const newRow = [];
            for (let c = 0; c < 3; c++) {
                const b = rowRef[c];
                if (!b) {
                    throw new Error("Board col out of range");
                }
                newRow.push(b);
            }
            newBoards.push(newRow);
        }
        const macroRow = newBoards[move.boardRow];
        if (!macroRow) {
            throw new Error("move.boardRow out of range");
        }
        if (!macroRow[move.boardCol]) {
            throw new Error("move.boardCol out of range");
        }
        macroRow[move.boardCol] = targetBoard;
        const newNext = { row: move.cellRow, col: move.cellCol };
        return new UltimateBoard(newBoards, newNext);
    }
}
exports.UltimateBoard = UltimateBoard;
//# sourceMappingURL=UltimateBoard.js.map