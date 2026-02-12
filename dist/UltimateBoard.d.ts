import { SmallBoard } from "./SmallBoard";
import type { Mark, Move } from "./index";
export declare class UltimateBoard {
    private boards;
    readonly nextBoard: {
        row: number;
        col: number;
    } | null;
    constructor(boards?: SmallBoard[][], nextBoard?: {
        row: number;
        col: number;
    } | null);
    getSmallBoard(boardRow: number, boardCol: number): SmallBoard;
    applyMove(move: Move, mark: Mark): UltimateBoard;
}
//# sourceMappingURL=UltimateBoard.d.ts.map