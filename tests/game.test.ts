import { describe, expect, test } from "vitest";
import { Game, SmallBoard, UltimateBoard } from "../src/engine/index.js";
import type { Move } from "../src/engine/index.js";

describe("Game.applyMove", () => {
  test("switches turn and keeps immutability", () => {
    const g0 = new Game();
    const move: Move = { boardRow: 0, boardCol: 0, cellRow: 1, cellCol: 1 };

    const g1 = g0.applyMove(move);

    expect(g0.currentPlayer).toBe("X");
    expect(g1.currentPlayer).toBe("O");

    // immutability check via legal move counts
    expect(g0.board.legalMoves().length).toBe(81);
    expect(g1.board.legalMoves().length).toBe(9);
  });

  test("rejects illegal move (not in legalMoves)", () => {
    const g0 = new Game();
    const illegal: Move = { boardRow: 0, boardCol: 0, cellRow: 9, cellCol: 9 };

    expect(() => g0.applyMove(illegal)).toThrowError("Illegal move: not legal");
  });

  test("rejects constraint-violating move via legalMoves()", () => {
    const g0 = new Game();
    const g1 = g0.applyMove({ boardRow: 0, boardCol: 0, cellRow: 1, cellCol: 1 });

    // nextBoard is (1,1), so playing again in (0,0) is illegal
    expect(() =>
      g1.applyMove({ boardRow: 0, boardCol: 0, cellRow: 0, cellCol: 0 })
    ).toThrowError("Illegal move: not legal");
  });

  test("rejects moves when game is already over", () => {
    const winX = () => {
      const b = new SmallBoard();
      b.place(0, 0, "X");
      b.place(0, 1, "X");
      b.place(0, 2, "X");
      return b;
    };

    const boards: SmallBoard[][] = [
      [winX(), winX(), winX()],
      [new SmallBoard(), new SmallBoard(), new SmallBoard()],
      [new SmallBoard(), new SmallBoard(), new SmallBoard()],
    ];

    const over = new Game(new UltimateBoard(boards, null), "O");

    expect(over.getStatus().kind).toBe("won");
    expect(() =>
      over.applyMove({ boardRow: 1, boardCol: 1, cellRow: 0, cellCol: 0 })
    ).toThrowError("Illegal move: game is already over");
  });
});

test("legalMoves delegates to board while playing", () => {
  const g0 = new Game();
  expect(g0.legalMoves().length).toBe(81);

  const g1 = g0.applyMove({ boardRow: 0, boardCol: 0, cellRow: 1, cellCol: 1 });
  expect(g1.legalMoves().length).toBe(9);
});

test("legalMoves is empty when game over", () => {
  const winX = () => {
    const b = new SmallBoard();
    b.place(0, 0, "X");
    b.place(0, 1, "X");
    b.place(0, 2, "X");
    return b;
  };

  const boards: SmallBoard[][] = [
    [winX(), winX(), winX()],
    [new SmallBoard(), new SmallBoard(), new SmallBoard()],
    [new SmallBoard(), new SmallBoard(), new SmallBoard()],
  ];

  const over = new Game(new UltimateBoard(boards, null), "O");
  expect(over.getStatus().kind).toBe("won");
  expect(over.legalMoves()).toEqual([]);
});

test("applyMoveFor enforces turn ownership", () => {
  const g0 = new Game();

  expect(() =>
    g0.applyMoveFor("O", { boardRow: 0, boardCol: 0, cellRow: 0, cellCol: 0 })
  ).toThrowError("Illegal move: not your turn");

  // correct player works
  const g1 = g0.applyMoveFor("X", { boardRow: 0, boardCol: 0, cellRow: 0, cellCol: 0 });
  expect(g1.currentPlayer).toBe("O");
});



describe("Game.getView", () => {
  test("returns a safe UI snapshot (mutating view does not affect game)", () => {
    const g0 = new Game();

    const v1 = g0.getView();
    expect(v1.boards[0]?.[0]?.grid[0]?.[0]).toBe(".");

    // mutate the returned view
    const cell = v1.boards[0]?.[0]?.grid[0];
    if (cell) cell[0] = "X";

    // game must be unchanged
    const v2 = g0.getView();
    expect(v2.boards[0]?.[0]?.grid[0]?.[0]).toBe(".");
  });
});


test("tryApplyMove returns null instead of throwing", () => {
  const g0 = new Game();

  // illegale move: buiten grid
  const res = g0.tryApplyMove({ boardRow: 0, boardCol: 0, cellRow: 9, cellCol: 9 });

  expect(res).toBeNull();
});

test("getCell returns correct mark", () => {
  const g0 = new Game();

  expect(g0.getCell(0, 0, 0, 0)).toBe(".");

  const g1 = g0.applyMove({
    boardRow: 0,
    boardCol: 0,
    cellRow: 0,
    cellCol: 0,
  });

  expect(g1.getCell(0, 0, 0, 0)).toBe("X");
});
