"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmallBoard = void 0;
class SmallBoard {
    grid;
    cell(row, col) {
        const rowRef = this.grid[row];
        if (!rowRef)
            return ".";
        return rowRef[col] ?? ".";
    }
    constructor() {
        this.grid = [
            [".", ".", "."],
            [".", ".", "."],
            [".", ".", "."],
        ];
    }
    getGrid() {
        return this.grid;
    }
    place(row, col, mark) {
        if (row < 0 || row > 2 || col < 0 || col > 2) {
            return false;
        }
        if (this.cell(row, col) !== ".") {
            return false;
        }
        const rowRef = this.grid[row];
        if (!rowRef) {
            return false;
        }
        rowRef[col] = mark;
        return true;
    }
    toString() {
        return this.grid.map(row => row.join(" ")).join("\n");
    }
    getWinner() {
        const lines = [
            // rijen
            [this.cell(0, 0), this.cell(0, 1), this.cell(0, 2)],
            [this.cell(1, 0), this.cell(1, 1), this.cell(1, 2)],
            [this.cell(2, 0), this.cell(2, 1), this.cell(2, 2)],
            // kolommen
            [this.cell(0, 0), this.cell(1, 0), this.cell(2, 0)],
            [this.cell(0, 1), this.cell(1, 1), this.cell(2, 1)],
            [this.cell(0, 2), this.cell(1, 2), this.cell(2, 2)],
            // diagonalen
            [this.cell(0, 0), this.cell(1, 1), this.cell(2, 2)],
            [this.cell(0, 2), this.cell(1, 1), this.cell(2, 0)],
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
    clone() {
        const copy = new SmallBoard();
        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 3; c++) {
                const value = this.cell(r, c);
                if (value !== ".") {
                    copy.place(r, c, value);
                }
            }
        }
        return copy;
    }
    isFull() {
        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 3; c++) {
                if (this.cell(r, c) === ".")
                    return false;
            }
        }
        return true;
    }
    getCell(row, col) {
        return this.cell(row, col);
    }
}
exports.SmallBoard = SmallBoard;
//# sourceMappingURL=SmallBoard.js.map