import type { Mark } from "./index";

/**
 * Represents a single 3×3 Tic Tac Toe board.
 *
 * A `SmallBoard` is the fundamental building block of the Ultimate Tic Tac Toe game.
 * Each instance maintains its own 3×3 grid of {@link Mark} values and is responsible for:
 *
 * - Storing cell state
 * - Validating placements
 * - Detecting local winners
 * - Detecting full-board (draw) conditions
 *
 * ## Design Notes
 *
 * - Internally mutable: `place()` modifies the board state.
 * - Externally treated as immutable at the `UltimateBoard` level
 *   (cloning is used before mutation).
 * - All cell access is range-checked.
 *
 * ## Coordinate System
 *
 * Rows and columns are indexed from 0 to 2.
 *
 * ```
 * (0,0) (0,1) (0,2)
 * (1,0) (1,1) (1,2)
 * (2,0) (2,1) (2,2)
 * ```
 *
 * ## Marks
 *
 * Each cell contains a {@link Mark}:
 * - `"X"`
 * - `"O"`
 * - `"."` (empty)
 */
export class SmallBoard {
    /**
     * Internal 3×3 grid storing the board state.
     */
    private grid: Mark[][];

    /**
     * Returns the mark stored at the given grid position.
     *
     * This is the single internal access point to the underlying grid.
     * All reads from the board should go through this method to ensure
     * consistent bounds checking.
     *
     * @param row Row index (0–2)
     * @param col Column index (0–2)
     * @returns The {@link Mark} at the specified position
     *
     * @throws Error if the row or column index is out of range
     *
     * Design note:
     * Out-of-range access indicates a programming error in the engine,
     * not invalid player input. Therefore, this method throws instead
     * of returning a fallback value.
     */
    private cell(row: number, col: number): Mark {
        const rowRef = this.grid[row];
        if (!rowRef) return ".";
        return rowRef[col] ?? ".";
    }

    /**
     * Creates a new empty 3×3 SmallBoard.
     *
     * All cells are initialized to "." (empty).
     *
     * Invariant established:
     * - The grid is exactly 3 rows
     * - Each row contains exactly 3 columns
     * - Every cell contains a valid {@link Mark}
     *
     * This constructor does not accept external input to ensure
     * the internal structure of the board is always valid.
     *
     * Higher-level game logic relies on this invariant when cloning
     * and composing boards inside {@link UltimateBoard}.
     */
    constructor() {
    this.grid = [
        [".", ".", "."],
        [".", ".", "."],
        [".", ".", "."],
        ];
    }

    /**
     * Returns a snapshot of the current grid state.
     *
     * A shallow copy of the internal 3×3 structure is returned
     * to prevent external mutation of board state.
     *
     * @returns A 3×3 matrix of {@link Mark} values
     */
    public getGrid(): Mark[][] {
        return this.grid.map(row => [...row]);
    }

    /**
     * Attempts to place a mark in the specified cell.
     *
     * The move is rejected if the coordinates are out of range or the cell
     * is already occupied.
     *
     * @param row Row index (0–2)
     * @param col Column index (0–2)
     * @param mark The mark to place ("X" or "O")
     * @returns `true` if the mark was placed, otherwise `false`
     */
    public place(row: number, col: number, mark: Mark): boolean {
        if (row < 0 || row > 2 || col < 0 || col > 2) {
            return false;
        }

        if (mark === ".") return false;

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

    /**
     * Returns a human-readable string representation of the board.
     *
     * The board is formatted as three rows separated by newline characters,
     * with cells separated by spaces.
     *
     * Example:
     * ```
     * X . O
     * . X .
     * O . X
     * ```
     *
     * Primarily intended for debugging and console-based inspection.
     */
    public toString(): string {
        return this.grid.map(row => row.join(" ")).join("\n");
    }

    /**
     * Determines whether this board has a winner.
     *
     * A player wins if they have three identical non-empty marks
     * in a row, column, or diagonal.
     *
     * @returns
     * - `"X"` if X has won
     * - `"O"` if O has won
     * - `null` if there is currently no winner
     *
     * Notes:
     * - An empty board or a full board without a winning line
     *   both return `null`.
     * - Draw detection is handled separately via {@link isFull()}.
     */
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
    
    /**
     * Creates a deep copy of this SmallBoard.
     *
     * All cell values are copied into a new instance, ensuring
     * the returned board is completely independent from the original.
     *
     * @returns A new {@link SmallBoard} with identical state
     *
     * Design note:
     * Cloning is required because `SmallBoard` is internally mutable,
     * while higher-level structures (such as {@link UltimateBoard})
     * treat boards as immutable. Mutation should always occur on
     * cloned instances.
     */
    public clone(): SmallBoard {
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

    /**
     * Determines whether the board is completely filled.
     *
     * A board is considered full when no cell contains ".".
     *
     * @returns `true` if all 9 cells are occupied, otherwise `false`
     *
     * Note:
     * A full board does not necessarily imply a winner.
     * Draw detection should combine {@link isFull()} with
     * {@link getWinner()}.
     */
    public isFull(): boolean {
        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 3; c++) {
            if (this.cell(r, c) === ".") return false;
            }
        }
        return true;
    }

    /**
     * Returns the mark at the specified position.
     *
     * This is a public read-only accessor for inspecting board state.
     * Bounds checking is delegated to an internal helper method.
     *
     * @param row Row index (0–2)
     * @param col Column index (0–2)
     * @returns The {@link Mark} stored at the given position
     *
     * @throws Error if the coordinates are out of range
     */
    public getCell(row: number, col: number): Mark {
        return this.cell(row, col);
    }


}
