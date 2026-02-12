import type { Mark } from "./index";
export declare class SmallBoard {
    private grid;
    private cell;
    constructor();
    getGrid(): Mark[][];
    place(row: number, col: number, mark: Mark): boolean;
    toString(): string;
    getWinner(): Mark | null;
    clone(): SmallBoard;
}
//# sourceMappingURL=SmallBoard.d.ts.map