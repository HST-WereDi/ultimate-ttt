import { describe, test, expect } from "vitest";
import { Game } from "../src/engine/Game.js";
import { BillyRandom as RandomAgent } from "../src/engine/ai/BillyRandom.js";
import { SmallBoard } from "../src/engine/SmallBoard.js";
import { UltimateBoard } from "../src/engine/UltimateBoard.js";

describe("RandomAgent", () => {
  test("returns a legal move while playing", () => {
    const agent = new RandomAgent();
    const game = new Game();

    const move = agent.chooseMove(game);

    expect(move).not.toBeNull();
    if (move) {
      expect(game.isMoveLegal(move)).toBe(true);
    }
  });

  test("returns null when game is over", () => {
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
    const agent = new RandomAgent();

    expect(over.getStatus().kind).toBe("won");
    expect(agent.chooseMove(over)).toBeNull();
  });
});
