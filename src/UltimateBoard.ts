import { SmallBoard } from "./SmallBoard";
import type { Mark, Move } from "./index";

/**
 * Represents the full 3×3 grid of {@link SmallBoard} instances used in Ultimate Tic Tac Toe.
 *
 * ## Core Responsibilities
 * - Stores the 3×3 matrix of small boards
 * - Enforces Ultimate Tic Tac Toe move constraints via {@link nextBoard}
 * - Applies moves immutably via {@link applyMove}
 * - Detects macro-level winners via {@link getWinner}
 * - Detects macro-level draws via {@link isDraw}
 * - Enumerates legal moves via {@link legalMoves}
 *
 * ## Immutability Model
 * `UltimateBoard` is treated as an immutable game state container:
 * - {@link applyMove} returns a new {@link UltimateBoard} instance
 * - Existing `UltimateBoard` instances are never mutated
 * - Only the targeted {@link SmallBoard} is cloned and modified
 *
 * Note: {@link SmallBoard} itself is internally mutable, but is used in an
 * immutable style by cloning before mutation.
 *
 * ## Move Constraint (`nextBoard`)
 * After a move is played in cell `(cellRow, cellCol)` of a small board, the next
 * move is constrained to the small board `(cellRow, cellCol)` on the macro board.
 *
 * If the constrained small board is not playable (already won or full),
 * the next player may choose any playable small board.
 *
 * `nextBoard === null` means there is currently no constraint.
 */
export class UltimateBoard {
    /**
     * Internal 3×3 matrix of {@link SmallBoard} instances.
     */
  private boards: SmallBoard[][];

  /**
 * Indicates the constrained small board for the next move.
 *
 * If non-null, the next move must be played in the specified
 * small board (row, col), provided that board is playable.
 *
 * If the referenced small board is already won or full,
 * the constraint is lifted and any playable board may be chosen.
 *
 * A value of `null` means there is currently no constraint.
 *
 * This property is read-only and part of the immutable
 * game state representation.
 */
  public readonly nextBoard: { row: number; col: number } | null;

  /**
     * Returns the macro-level mark corresponding to a small board.
     *
     * If the specified small board has a winner, that winner ("X" or "O")
     * is returned. Otherwise "." is returned to indicate that the small
     * board does not contribute to a macro winning line.
     *
     * @param boardRow Macro row index (0–2)
     * @param boardCol Macro column index (0–2)
     * @returns The winning {@link Mark} of the small board, or "." if none
     *
     * This helper is used internally for macro winner detection.
     */
    private macroMark(boardRow: number, boardCol: number): Mark {
        const b = this.getSmallBoard(boardRow, boardCol);
        const w = b.getWinner();
        return w ?? ".";
    }

/**
 * Creates a new UltimateBoard game state.
 *
 * @param boards Optional preconstructed 3×3 matrix of {@link SmallBoard} instances.
 *               If omitted, a fresh 3×3 grid of empty SmallBoards is created.
 * @param nextBoard The constrained small board for the next move, or `null`
 *                  if no constraint is active.
 *
 * Design notes:
 * - This constructor does not deep-clone the provided boards.
 *   It assumes the caller provides a valid 3×3 structure.
 * - Immutability is enforced at the usage level: new board matrices
 *   are created when applying moves.
 *
 * Invariant expected:
 * - `boards`, if provided, must be a 3×3 matrix of SmallBoard instances.
 */
  constructor(
    boards?: SmallBoard[][],
    nextBoard: { row: number; col: number } | null = null
  ) {
    if (boards) {
      this.boards = boards;
    } else {
      this.boards = [
        [new SmallBoard(), new SmallBoard(), new SmallBoard()],
        [new SmallBoard(), new SmallBoard(), new SmallBoard()],
        [new SmallBoard(), new SmallBoard(), new SmallBoard()],
      ];
    }

    this.nextBoard = nextBoard;
  }

  /**
 * Returns the {@link SmallBoard} at the specified macro position.
 *
 * @param boardRow Row index of the macro board (0–2)
 * @param boardCol Column index of the macro board (0–2)
 * @returns The corresponding {@link SmallBoard}
 *
 * @throws Error if the provided coordinates are out of range
 *
 * Design note:
 * This method centralizes bounds checking for macro-level access.
 * Out-of-range access indicates a programming error in the engine,
 * not invalid player input.
 */
  public getSmallBoard(boardRow: number, boardCol: number): SmallBoard {
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

    /**
     * Applies a move and returns the resulting {@link UltimateBoard} state.
     *
     * This method enforces Ultimate Tic Tac Toe rules:
     * - No moves are allowed after the game is over (win or draw).
     * - If {@link nextBoard} is set and that small board is playable,
     *   the move must be made inside that constrained small board.
     * - The chosen cell must be in range and currently empty.
     *
     * ## Immutability
     * The current instance is never mutated. A new 3×3 board matrix is created,
     * and only the targeted {@link SmallBoard} is cloned and modified.
     *
     * @param move Macro + micro coordinates describing the move
     * @param mark The mark to place ("X" or "O")
     * @returns A new {@link UltimateBoard} reflecting the applied move
     *
     * @throws Error if the move is illegal (game over, constraint violation,
     *         out of range indices, or the target cell is not empty)
     */
    public applyMove(move: Move, mark: Mark): UltimateBoard {

        if (this.getWinner() !== null || this.isDraw()) {
            throw new Error("Illegal move: game is already over");
        }

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

        const newBoards: SmallBoard[][] = [];

        for (let r = 0; r < 3; r++) {
            const rowRef = this.boards[r];
            if (!rowRef) {
            throw new Error("Board row out of range");
            }

            const newRow: SmallBoard[] = [];

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

    /**
     * Determines whether a specific small board is currently playable.
     *
     * A small board is considered playable if:
     * - It has no winner, and
     * - It is not full.
     *
     * @param row Macro row index (0–2)
     * @param col Macro column index (0–2)
     * @returns `true` if the small board can accept new moves, otherwise `false`
     *
     * This method is used to enforce move constraints and to determine
     * whether a constrained board should be ignored.
     */
    public isBoardPlayable(row: number, col: number): boolean {
        const b = this.getSmallBoard(row, col);
        return b.getWinner() === null && !b.isFull();
    }

    /**
     * Determines whether the macro board has a winner.
     *
     * A player wins the game if they have won three small boards
     * in a row, column, or diagonal on the macro grid.
     *
     * Only small boards with a winner contribute to macro evaluation.
     * Unfinished or drawn small boards are treated as ".".
     *
     * @returns
     * - `"X"` if X has won the macro board
     * - `"O"` if O has won the macro board
     * - `null` if there is currently no macro winner
     *
     * Note:
     * A full macro board without a winning line results in a draw,
     * which is detected separately via {@link isDraw()}.
     */
    public getWinner(): Mark | null {
        const lines: Mark[][] = [
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
            if (!a || !b || !c) continue;

            if (a !== "." && a === b && b === c) {
            return a;
            }
        }

        return null;
    }

    /**
     * Determines whether the game has ended in a draw.
     *
     * A draw occurs when:
     * - There is no macro winner, and
     * - No legal moves remain.
     *
     * @returns `true` if the game is a draw, otherwise `false`
     *
     * Note:
     * This method should be checked after {@link getWinner()} when
     * evaluating overall game state.
     */
    public isDraw(): boolean {
        return this.getWinner() === null && this.legalMoves().length === 0;
    }


    /**
     * Computes all currently legal moves from this game state.
     *
     * Move generation respects the Ultimate Tic Tac Toe constraint rules:
     * - If {@link nextBoard} is set and that small board is playable,
     *   only moves within that small board are returned.
     * - Otherwise, moves from all playable small boards are returned.
     *
     * A move is legal if it targets a playable small board and an empty cell (".").
     *
     * @returns An array of {@link Move} objects representing all legal moves
     *
     * This method is used for:
     * - enforcing legality checks at higher levels (e.g., a `Game` class)
     * - detecting macro draws (when no moves remain)
     * - AI search (minimax / MCTS) and multiplayer validation
     */
    public legalMoves(): Move[] {
        const moves: Move[] = [];

        const addMovesFromBoard = (br: number, bc: number) => {
            const b = this.getSmallBoard(br, bc);

            // Alleen als het minibord speelbaar is
            if (!this.isBoardPlayable(br, bc)) return;

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
