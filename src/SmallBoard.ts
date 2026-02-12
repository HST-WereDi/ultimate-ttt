import type { Mark } from "./index";

export class SmallBoard {
    private grid: Mark[][];

    private cell(row: number, col: number): Mark {
        const rowRef = this.grid[row];
        if (!rowRef) return ".";
        return rowRef[col] ?? ".";
    }


    constructor() {
    this.grid = [
        [".", ".", "."],
        [".", ".", "."],
        [".", ".", "."],
        ];
    }

    public getGrid(): Mark[][] {
        return this.grid;
    }

    public place(row: number, col: number, mark: Mark): boolean {
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


    public toString(): string {
        return this.grid.map(row => row.join(" ")).join("\n");
    }

    public getWinner(): Mark | null {
        const lines: Mark[][] = [
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

            if (!a || !b || !c) continue;

            if (a !== "." && a === b && b === c) {
            return a;
            }
        }
        return null;
    }
    
}
