import { SmallBoard } from "./SmallBoard";
import type { Mark, Move } from "./index";
export declare class UltimateBoard {
    private boards;
    readonly nextBoard: {
        row: number;
        col: number;
    } | null;
    private macroMark;
    constructor(boards?: SmallBoard[][], nextBoard?: {
        row: number;
        col: number;
    } | null);
    getSmallBoard(boardRow: number, boardCol: number): SmallBoard;
    applyMove(move: Move, mark: Mark): UltimateBoard;
    isBoardPlayable(row: number, col: number): boolean;
    getWinner(): Mark | null;
    legalMoves(): Move[];
}
//# sourceMappingURL=UltimateBoard.d.ts.map