import { describe, it, expect } from "vitest";

import { SmallBoard } from "../src/SmallBoard.js";
import { UltimateBoard } from "../src/UltimateBoard.js";
import type { Mark, Move } from "../src/index.js";

/**
 * Helpers
 */
function move(
  boardRow: number,
  boardCol: number,
  cellRow: number,
  cellCol: number
): Move {
  return { boardRow, boardCol, cellRow, cellCol };
}

function makeWonSmallBoard(winner: Exclude<Mark, ".">): SmallBoard {
  const b = new SmallBoard();
  // win on top row
  b.place(0, 0, winner);
  b.place(0, 1, winner);
  b.place(0, 2, winner);
  return b;
}

function makeDrawSmallBoard(): SmallBoard {
  // Full, no winner:
  // X O X
  // X X O
  // O X O
  const b = new SmallBoard();
  b.place(0, 0, "X"); b.place(0, 1, "O"); b.place(0, 2, "X");
  b.place(1, 0, "X"); b.place(1, 1, "X"); b.place(1, 2, "O");
  b.place(2, 0, "O"); b.place(2, 1, "X"); b.place(2, 2, "O");
  return b;
}

describe("1) SmallBoard basics (constructor, place, toString)", () => {
  it("starts empty", () => {
    const b = new SmallBoard();
    expect(b.toString()).toBe(". . .\n. . .\n. . .");
    expect(b.getWinner()).toBeNull();
    expect(b.isFull()).toBe(false);
  });

  it("place() returns true on empty in-range cell, false otherwise", () => {
    const b = new SmallBoard();

    expect(b.place(1, 1, "X")).toBe(true);
    expect(b.place(1, 1, "O")).toBe(false); // already occupied

    expect(b.place(-1, 0, "X")).toBe(false);
    expect(b.place(0, 3, "X")).toBe(false);
  });

  it("toString reflects placements", () => {
    const b = new SmallBoard();
    b.place(0, 0, "X");
    b.place(2, 2, "O");
    expect(b.toString()).toBe("X . .\n. . .\n. . O");
  });
});

describe("2) SmallBoard winner detection", () => {
  it("detects row win", () => {
    const b = new SmallBoard();
    b.place(1, 0, "X");
    b.place(1, 1, "X");
    b.place(1, 2, "X");
    expect(b.getWinner()).toBe("X");
  });

  it("detects column win", () => {
    const b = new SmallBoard();
    b.place(0, 2, "O");
    b.place(1, 2, "O");
    b.place(2, 2, "O");
    expect(b.getWinner()).toBe("O");
  });

  it("detects diagonal win", () => {
    const b = new SmallBoard();
    b.place(0, 0, "X");
    b.place(1, 1, "X");
    b.place(2, 2, "X");
    expect(b.getWinner()).toBe("X");
  });

  it("returns null when no win", () => {
    const b = new SmallBoard();
    b.place(0, 0, "X");
    b.place(0, 1, "O");
    b.place(0, 2, "X");
    expect(b.getWinner()).toBeNull();
  });
});

describe("3) SmallBoard clone()", () => {
  it("clone copies marks but is independent of future mutations", () => {
    const original = new SmallBoard();
    original.place(0, 0, "X");

    const copy = original.clone();
    expect(copy.toString()).toBe(original.toString());

    // mutate original after cloning; copy should stay the same
    original.place(2, 2, "O");
    expect(original.toString()).toBe("X . .\n. . .\n. . O");
    expect(copy.toString()).toBe("X . .\n. . .\n. . .");
  });
});

describe("4) SmallBoard isFull()", () => {
  it("isFull is false until all cells filled", () => {
    const b = new SmallBoard();
    expect(b.isFull()).toBe(false);

    // fill 8 cells
    let i = 0;
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (r === 2 && c === 2) continue;
        const mark: Mark = i % 2 === 0 ? "X" : "O";
        b.place(r, c, mark);
        i++;
      }
    }
    expect(b.isFull()).toBe(false);

    b.place(2, 2, "X");
    expect(b.isFull()).toBe(true);
  });

  it("a draw board is full and has no winner", () => {
    const d = makeDrawSmallBoard();
    expect(d.isFull()).toBe(true);
    expect(d.getWinner()).toBeNull();
  });
});

describe("5) UltimateBoard basics (constructor, getSmallBoard)", () => {
  it("default constructor creates 9 boards and nextBoard is null", () => {
    const ub = new UltimateBoard();
    expect(ub.nextBoard).toBeNull();
    expect(ub.getSmallBoard(0, 0)).toBeInstanceOf(SmallBoard);
    expect(ub.getSmallBoard(2, 2)).toBeInstanceOf(SmallBoard);
  });

  it("getSmallBoard throws on out-of-range", () => {
    const ub = new UltimateBoard();
    expect(() => ub.getSmallBoard(-1, 0)).toThrow();
    expect(() => ub.getSmallBoard(0, 3)).toThrow();
  });
});

describe("6) UltimateBoard applyMove() immutability + nextBoard update", () => {
  it("applyMove returns a new UltimateBoard and does not mutate previous boards", () => {
    const ub1 = new UltimateBoard();

    const ub2 = ub1.applyMove(move(0, 0, 1, 1), "X");

    // ub1 unchanged
    expect(ub1.getSmallBoard(0, 0).toString()).toBe(". . .\n. . .\n. . .");

    // ub2 has the mark
    expect(ub2.getSmallBoard(0, 0).toString()).toBe(". . .\n. X .\n. . .");
  });

  it("nextBoard becomes the played cell position (cellRow, cellCol)", () => {
    const ub1 = new UltimateBoard();
    const ub2 = ub1.applyMove(move(2, 1, 0, 2), "O");

    expect(ub2.nextBoard).toEqual({ row: 0, col: 2 });
  });

  it("throws if placing on occupied cell", () => {
    const ub1 = new UltimateBoard();
    const ub2 = ub1.applyMove(move(0, 0, 0, 0), "X");

    expect(() => ub2.applyMove(move(0, 0, 0, 0), "O")).toThrow(
      /cell is not empty/i
    );
  });
});

describe("7) UltimateBoard constraint enforcement", () => {
  it("enforces constraint when nextBoard is playable", () => {
    const ub = new UltimateBoard(undefined, { row: 0, col: 0 });

    expect(() =>
      ub.applyMove(move(1, 1, 0, 0), "X")
    ).toThrow(/constrained small board/i);
  });

  it("does NOT enforce constraint when constrained board is NOT playable because it's full (draw)", () => {
    const draw = makeDrawSmallBoard();

    const boards: SmallBoard[][] = [
      [new SmallBoard(), new SmallBoard(), new SmallBoard()],
      [new SmallBoard(), draw,            new SmallBoard()],
      [new SmallBoard(), new SmallBoard(), new SmallBoard()],
    ];

    // nextBoard points to the draw board (1,1)
    const ub = new UltimateBoard(boards, { row: 1, col: 1 });

    // should be allowed to play elsewhere
    expect(() =>
      ub.applyMove(move(0, 0, 2, 2), "X")
    ).not.toThrow();
  });
});

describe("8) UltimateBoard macro winner detection", () => {
  it("returns macro winner when 3 smallboards in a line are won", () => {
    const x = makeWonSmallBoard("X");
    const empty = new SmallBoard();

    const boards: SmallBoard[][] = [
      [x, x, x],                 // top macro row won by X
      [empty, empty, empty],
      [empty, empty, empty],
    ];

    const ub = new UltimateBoard(boards, null);
    expect(ub.getWinner()).toBe("X");
  });

  it("returns null when no macro winner", () => {
    const boards: SmallBoard[][] = [
      [makeWonSmallBoard("X"), new SmallBoard(), new SmallBoard()],
      [new SmallBoard(), makeWonSmallBoard("O"), new SmallBoard()],
      [new SmallBoard(), new SmallBoard(), new SmallBoard()],
    ];

    const ub = new UltimateBoard(boards, null);
    expect(ub.getWinner()).toBeNull();
  });
});

describe("9) UltimateBoard legalMoves()", () => {
  it("returns 81 moves on a fresh board (no constraint)", () => {
    const ub = new UltimateBoard();
    expect(ub.legalMoves()).toHaveLength(81);
  });

  it("returns only moves from constrained board when nextBoard is playable", () => {
    const ub = new UltimateBoard(undefined, { row: 1, col: 2 });
    const moves = ub.legalMoves();
    expect(moves).toHaveLength(9);
    expect(moves.every(m => m.boardRow === 1 && m.boardCol === 2)).toBe(true);
  });

  it("constraint is ignored when nextBoard is not playable (full/draw)", () => {
    const draw = makeDrawSmallBoard();

    const boards: SmallBoard[][] = [
      [new SmallBoard(), new SmallBoard(), new SmallBoard()],
      [new SmallBoard(), draw,            new SmallBoard()],
      [new SmallBoard(), new SmallBoard(), new SmallBoard()],
    ];

    const ub = new UltimateBoard(boards, { row: 1, col: 1 });
    const moves = ub.legalMoves();

    // 8 miniborden speelbaar * 9 zetten = 72
    expect(moves).toHaveLength(72);
    // en geen enkele move mag in (1,1) zitten
    expect(moves.some(m => m.boardRow === 1 && m.boardCol === 1)).toBe(false);
  });

  it("does not include occupied cells", () => {
    const ub1 = new UltimateBoard();
    const ub2 = ub1.applyMove(move(0, 0, 0, 0), "X");

    const moves = ub2.legalMoves();
    // NextBoard is constrained to (0,0) now, so only that board: 8 remaining moves
    expect(moves).toHaveLength(8);
    expect(moves.some(m => m.boardRow === 0 && m.boardCol === 0 && m.cellRow === 0 && m.cellCol === 0)).toBe(false);
  });
});

describe("10) UltimateBoard macro draw + game-over", () => {
  it("isDraw is true when no winner and no legal moves", () => {
    // Maak 9 draw smallboards
    const d = makeDrawSmallBoard();
    const boards: SmallBoard[][] = [
      [d, d, d],
      [d, d, d],
      [d, d, d],
    ];

    const ub = new UltimateBoard(boards, null);

    expect(ub.getWinner()).toBeNull();
    expect(ub.legalMoves()).toHaveLength(0);
    expect(ub.isDraw()).toBe(true);
  });

  it("applyMove throws when game is over (draw)", () => {
    const d = makeDrawSmallBoard();
    const boards: SmallBoard[][] = [
      [d, d, d],
      [d, d, d],
      [d, d, d],
    ];

    const ub = new UltimateBoard(boards, null);

    expect(() =>
      ub.applyMove(move(0, 0, 0, 0), "X")
    ).toThrow(/game is already over/i);
  });

  it("applyMove throws when game is over (winner)", () => {
    const x = makeWonSmallBoard("X");
    const empty = new SmallBoard();

    const boards: SmallBoard[][] = [
      [x, x, x], // macro win
      [empty, empty, empty],
      [empty, empty, empty],
    ];

    const ub = new UltimateBoard(boards, null);

    expect(ub.getWinner()).toBe("X");
    expect(() =>
      ub.applyMove(move(1, 1, 0, 0), "O")
    ).toThrow(/game is already over/i);
  });
});
