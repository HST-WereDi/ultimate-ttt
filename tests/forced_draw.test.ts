import { describe, expect, it } from "vitest";
import { UltimateBoard } from "../src/engine/UltimateBoard";
import { SmallBoard } from "../src/engine/SmallBoard";
import { Game } from "../src/engine/Game";
import type { Mark } from "../src/engine/index";

function makeWonBoard(winner: Exclude<Mark, ".">): SmallBoard {
  const b = new SmallBoard();
  // win op eerste rij
  b.place(0, 0, winner);
  b.place(0, 1, winner);
  b.place(0, 2, winner);
  return b;
}

function makeDrawBoard(): SmallBoard {
  const b = new SmallBoard();
  // Vol bord zonder winnaar (klassiek draw patroon)
  // X O X
  // X O O
  // O X X
  b.place(0, 0, "X");
  b.place(0, 1, "O");
  b.place(0, 2, "X");

  b.place(1, 0, "X");
  b.place(1, 1, "O");
  b.place(1, 2, "O");

  b.place(2, 0, "O");
  b.place(2, 1, "X");
  b.place(2, 2, "X");

  // sanity: geen winnaar en wel vol
  expect(b.getWinner()).toBeNull();
  expect(b.isFull()).toBe(true);

  return b;
}

describe("Forced draw (no macro winner possible)", () => {
  it("UltimateBoard.isDraw() becomes true if no macro winner can ever occur (even with moves left)", () => {
    // Macro layout:
    // O  D  X
    // D  D  D
    // O  D  X
    const boards: SmallBoard[][] = [
      [makeWonBoard("O"), makeDrawBoard(), makeWonBoard("X")],
      [makeDrawBoard(), makeDrawBoard(), makeDrawBoard()],
      [makeWonBoard("O"), makeDrawBoard(), makeWonBoard("X")],
    ];

    const ub = new UltimateBoard(boards, null);

    // Er is geen macro winner:
    expect(ub.getWinner()).toBeNull();

    // Maar ook: er zijn geen zetten meer (want alles won/draw),
    // en forced draw moet sowieso true zijn.
    expect(ub.isDraw()).toBe(true);
  });

  it("Game.getStatus() reports draw for forced-draw boards", () => {
    const boards: SmallBoard[][] = [
      [makeWonBoard("O"), makeDrawBoard(), makeWonBoard("X")],
      [makeDrawBoard(), makeDrawBoard(), makeDrawBoard()],
      [makeWonBoard("O"), makeDrawBoard(), makeWonBoard("X")],
    ];

    const g = new Game(new UltimateBoard(boards, null), "X");

    expect(g.getStatus().kind).toBe("draw");
  });
});
