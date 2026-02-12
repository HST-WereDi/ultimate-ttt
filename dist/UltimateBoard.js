"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UltimateBoard = void 0;
const SmallBoard_1 = require("./SmallBoard");
class UltimateBoard {
    boards;
    nextBoard;
    macroMark(boardRow, boardCol) {
        const b = this.getSmallBoard(boardRow, boardCol);
        const w = b.getWinner();
        return w ?? ".";
    }
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
        if (this.nextBoard && this.isBoardPlayable(this.nextBoard.row, this.nextBoard.col)) {
            if (move.boardRow !== this.nextBoard.row || move.boardCol !== this.nextBoard.col) {
                throw new Error("Illegal move: must play in the constrained small board");
            }
        }
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
    isBoardPlayable(row, col) {
        const b = this.getSmallBoard(row, col);
        return b.getWinner() === null && !b.isFull();
    }
    getWinner() {
        const lines = [
            [this.macroMark(0, 0), this.macroMark(0, 1), this.macroMark(0, 2)],
            [this.macroMark(1, 0), this.macroMark(1, 1), this.macroMark(1, 2)],
            [this.macroMark(2, 0), this.macroMark(2, 1), this.macroMark(2, 2)],
            [this.macroMark(0, 0), this.macroMark(1, 0), this.macroMark(2, 0)],
            [this.macroMark(0, 1), this.macroMark(1, 1), this.macroMark(2, 1)],
            [this.macroMark(0, 2), this.macroMark(1, 2), this.macroMark(2, 2)],
            [this.macroMark(0, 0), this.macroMark(1, 1), this.macroMark(2, 2)],
            [this.macroMark(0, 2), this.macroMark(1, 1), this.macroMark(2, 0)],
        ];
        for (const line of lines) {
            const a = line[0];
            const b = line[1];
            const c = line[2];
            if (!a || !b || !c)
                continue;
            if (a !== "." && a === b && b === c) {
                return a;
            }
        }
        return null;
    }
    legalMoves() {
        const moves = [];
        const addMovesFromBoard = (br, bc) => {
            const b = this.getSmallBoard(br, bc);
            // Alleen als het minibord speelbaar is
            if (!this.isBoardPlayable(br, bc))
                return;
            for (let r = 0; r < 3; r++) {
                for (let c = 0; c < 3; c++) {
                    if (b.getCell(r, c) === ".") {
                        moves.push({ boardRow: br, boardCol: bc, cellRow: r, cellCol: c });
                    }
                }
            }
        };
        // Constraint: als nextBoard speelbaar is -> alleen daar
        if (this.nextBoard && this.isBoardPlayable(this.nextBoard.row, this.nextBoard.col)) {
            addMovesFromBoard(this.nextBoard.row, this.nextBoard.col);
            return moves;
        }
        // Anders: alle speelbare miniborden
        for (let br = 0; br < 3; br++) {
            for (let bc = 0; bc < 3; bc++) {
                addMovesFromBoard(br, bc);
            }
        }
        return moves;
    }
}
exports.UltimateBoard = UltimateBoard;
//# sourceMappingURL=UltimateBoard.js.map