import { describe, expect, it } from "vitest";
import { UltimateBoard } from "../src/engine/UltimateBoard";
import { SmallBoard } from "../src/engine/SmallBoard";
import type { Move, Mark } from "../src/engine/index";

function makeEmptyBoards(): SmallBoard[][] {
  return [
    [new SmallBoard(), new SmallBoard(), new SmallBoard()],
    [new SmallBoard(), new SmallBoard(), new SmallBoard()],
    [new SmallBoard(), new SmallBoard(), new SmallBoard()],
  ];
}

function makeWonBoard(winner: Exclude<Mark, ".">): SmallBoard {
  const b = new SmallBoard();
  // win op eerste rij
  b.place(0, 0, winner);
  b.place(0, 1, winner);
  b.place(0, 2, winner);
  return b;
}

describe("UltimateBoard nextBoard constraint (edge cases)", () => {
  it("legalMoves: if nextBoard points to an unplayable small board, constraint is lifted (free choice)", () => {
    const boards = makeEmptyBoards();
    boards[1][1] = makeWonBoard("X");

    const ub = new UltimateBoard(boards, { row: 1, col: 1 });

    const moves = ub.legalMoves();

    // Als constraint NIET lifted zou worden, dan zouden alle moves boardRow=1, boardCol=1 zijn.
    // We verwachten juist: moves van andere boards bestaan.
    expect(moves.some((m) => m.boardRow !== 1 || m.boardCol !== 1)).toBe(true);

    // En natuurlijk: geen moves in het gewonnen board
    expect(moves.some((m) => m.boardRow === 1 && m.boardCol === 1)).toBe(false);
  });

  it("applyMove: if move sends opponent to an unplayable board, nextBoard becomes null", () => {
    const boards = makeEmptyBoards();
    boards[2][2] = makeWonBoard("O"); // target board is al onplayable

    const ub = new UltimateBoard(boards, null);

    const move: Move = { boardRow: 0, boardCol: 0, cellRow: 2, cellCol: 2 }; // stuurt naar (2,2)
    const next = ub.applyMove(move, "X");

    expect(next.nextBoard).toBeNull();
  });

  it("applyMove: if nextBoard is set to a playable board, you must play there", () => {
    const ub = new UltimateBoard(undefined, { row: 1, col: 1 });

    const illegal: Move = { boardRow: 0, boardCol: 0, cellRow: 0, cellCol: 0 };

    expect(() => ub.applyMove(illegal, "X")).toThrow(
      /constrained small board/i
    );
  });
});
