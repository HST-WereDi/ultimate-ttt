import type { Mark, Move } from "./index.js";
import { UltimateBoard } from "./UltimateBoard.js";

export type GameStatus =
  | { kind: "playing" }
  | { kind: "won"; winner: Exclude<Mark, "."> }
  | { kind: "draw" };

export type SmallBoardView = {
  grid: Mark[][];
  winner: Exclude<Mark, "."> | null;
  isPlayable: boolean;
};

export type GameView = {
  status: GameStatus;
  currentPlayer: Exclude<Mark, ".">;
  nextBoard: { row: number; col: number } | null;
  boards: SmallBoardView[][];
};

/**
 * Pure, immutable state machine for Ultimate Tic Tac Toe.
 *
 * ## Guarantees
 * - **Deterministic**: no randomness, no I/O, no time dependencies.
 * - **Immutable**: `applyMove` returns a new `Game`; existing instances are never mutated.
 * - **Engine-only**: no DOM/React concerns; UI should interact through `getView()`, `legalMoves()`, and `tryApplyMove()`.
 *
 * ## Turn + status rules
 * - If `getStatus().kind !== "playing"`, then `legalMoves()` is empty and `applyMove()` will throw.
 * - `currentPlayer` alternates strictly between `"X"` and `"O"` after a successful move.
 *
 * ## Move legality
 * - Legality is defined by `UltimateBoard.legalMoves()` (including constraint rules via `nextBoard`).
 * - `applyMove()` throws on illegal moves; `tryApplyMove()` returns `null` instead.
 *
 * ## UI contract
 * - Use `getView()` for a render-friendly snapshot (safe copies for grids, winner info, playability, and `nextBoard` constraint).
 */
export class Game {
  public readonly board: UltimateBoard;
  public readonly currentPlayer: Exclude<Mark, ".">;


  /**
     * Creates a new immutable Game state.
     *
     * @param board The underlying UltimateBoard state.
     *              Defaults to a fresh empty board.
     * @param currentPlayer The player to move ("X" or "O").
     *                      Defaults to "X".
     *
     * Design notes:
     * - The provided `board` is assumed to be a valid immutable state.
     * - No deep cloning occurs here; immutability is enforced by always
     *   constructing a new `Game` when applying moves.
     */
  constructor(
    board: UltimateBoard = new UltimateBoard(),
    currentPlayer: Exclude<Mark, "."> = "X"
  ) {
    this.board = board;
    this.currentPlayer = currentPlayer;
  }

    /**
     * Computes the current overall game status.
     *
     * Evaluation order:
     * 1. If the macro board has a winner → `{ kind: "won", winner }`
     * 2. If the game is a draw (classic or forced) → `{ kind: "draw" }`
     * 3. Otherwise → `{ kind: "playing" }`
     *
     * Draw detection is delegated to `UltimateBoard.isDraw()` and includes:
     * - No legal moves remaining (classic draw)
     * - No macro winner being possible anymore for either player (forced draw)
     */
    public getStatus(): GameStatus {
    const w = this.board.getWinner();
    if (w === "X" || w === "O") return { kind: "won", winner: w };
    if (this.board.isDraw()) return { kind: "draw" };
    return { kind: "playing" };
    }

    /**
     * Applies a move for the current player and returns the resulting Game state.
     *
     * Preconditions:
     * - The game must still be in the `"playing"` state.
     * - The move must be legal according to `legalMoves()`.
     *
     * Postconditions:
     * - A new immutable `Game` instance is returned.
     * - The underlying `UltimateBoard` is replaced with its updated copy.
     * - `currentPlayer` is toggled ("X" ↔ "O").
     *
     * @param move The macro + micro coordinates describing the move.
     * @throws Error if the game is over or the move is illegal.
     */
    public applyMove(move: Move): Game {
    if (this.getStatus().kind !== "playing") {
        throw new Error("Illegal move: game is already over");
    }

    if (!this.isMoveLegal(move)) {
    throw new Error("Illegal move: not legal");
    }

    const newBoard = this.board.applyMove(move, this.currentPlayer);
    const nextPlayer: Exclude<Mark, "."> = this.currentPlayer === "X" ? "O" : "X";

    return new Game(newBoard, nextPlayer);
    }

    /**
     * Returns all legal moves in the current state.
     *
     * Rules:
     * - If the game is not in `"playing"` state, an empty array is returned.
     * - Otherwise, legality is delegated to `UltimateBoard.legalMoves()`,
     *   which enforces nextBoard constraints and cell availability.
     *
     * This method never throws and is safe for UI rendering and AI search.
     */
    public legalMoves(): Move[] {
        if (this.getStatus().kind !== "playing") return [];
        return this.board.legalMoves();
    }

    /**
     * Checks whether a move is currently legal.
     *
     * A move is considered legal if it appears in `legalMoves()`.
     * This implicitly enforces:
     * - Game must be in `"playing"` state
     * - Constraint rules via `nextBoard`
     * - Target cell must be empty
     *
     * @param move The move to validate.
     * @returns `true` if the move is legal, otherwise `false`.
     *
     * This method is pure and does not modify state.
     */
    public isMoveLegal(move: Move): boolean {
        return this.legalMoves().some(
            (m) =>
            m.boardRow === move.boardRow &&
            m.boardCol === move.boardCol &&
            m.cellRow === move.cellRow &&
            m.cellCol === move.cellCol
        );
    }

    /**
     * Applies a move on behalf of a specific player.
     *
     * This is primarily intended for AI agents or external controllers
     * that explicitly specify which mark is moving.
     *
     * Preconditions:
     * - `mark` must equal `currentPlayer`.
     * - The move must be legal.
     *
     * @param mark The player attempting to move ("X" or "O").
     * @param move The move to apply.
     * @returns A new immutable Game state after the move.
     * @throws Error if it is not the specified player's turn.
     */
    public applyMoveFor(mark: Exclude<Mark, ".">, move: Move): Game {
    if (mark !== this.currentPlayer) {
        throw new Error("Illegal move: not your turn");
    }
    return this.applyMove(move);
    }

    /**
     * Returns a render-friendly snapshot of the current game state.
     *
     * This method converts internal engine structures into a
     * UI-safe representation:
     *
     * - Provides `status` and `currentPlayer`
     * - Exposes `nextBoard` constraint
     * - Returns a 3×3 matrix of small board views
     * - Ensures grids are safe copies (no mutable references leak)
     *
     * This method does not mutate state and is safe to call
     * during rendering.
     */
    public getView(): GameView {
        const boards: SmallBoardView[][] = [];

        for (let br = 0; br < 3; br++) {
            const row: SmallBoardView[] = [];
            for (let bc = 0; bc < 3; bc++) {
            const sb = this.board.getSmallBoard(br, bc);
            const w = sb.getWinner();
            row.push({
                grid: sb.getGrid(), // safe copy
                winner: w === "X" || w === "O" ? w : null,
                isPlayable: this.board.isBoardPlayable(br, bc),
            });
            }
            boards.push(row);
        }

        return {
            status: this.getStatus(),
            currentPlayer: this.currentPlayer,
            nextBoard: this.board.nextBoard,
            boards,
        };
    }

    /**
     * Attempts to apply a move safely.
     *
     * This is a convenience wrapper around `applyMove`.
     *
     * - If the move is legal, a new Game state is returned.
     * - If the move is illegal, `null` is returned instead of throwing.
     *
     * Intended for UI usage where exceptions are undesirable.
     *
     * @param move The move to attempt.
     * @returns A new Game instance if successful, otherwise `null`.
     */
    public tryApplyMove(move: Move): Game | null {
        try {
            return this.applyMove(move);
        } catch {
            return null;
        }
    }

    /**
     * Returns the mark stored in a specific cell.
     *
     * This is a convenience passthrough to the underlying `UltimateBoard`
     * and `SmallBoard` for read-only inspection.
     *
     * @param boardRow Macro board row index (0–2)
     * @param boardCol Macro board column index (0–2)
     * @param cellRow Micro board row index (0–2)
     * @param cellCol Micro board column index (0–2)
     * @returns The mark at the specified location ("X", "O", or ".").
     *
     * This method does not modify state.
     */
    public getCell(
        boardRow: number,
        boardCol: number,
        cellRow: number,
        cellCol: number
        ): Mark {
        return this.board
            .getSmallBoard(boardRow, boardCol)
            .getCell(cellRow, cellCol);
        }


}
