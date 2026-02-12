import { describe, expect, it } from "vitest";
import { Game } from "../src/engine/Game";
import type { Move } from "../src/engine/index";

describe("Game.tryApplyMove", () => {
  it("returns null for an illegal move (wrong constrained board)", () => {
    // Eerste zet: X speelt in (1,1) cel (0,0) -> nextBoard wordt (0,0)
    let g = new Game();
    g = g.applyMove({ boardRow: 1, boardCol: 1, cellRow: 0, cellCol: 0 });

    // O probeert nu in een ander miniboard te spelen -> illegaal -> null
    const illegal: Move = { boardRow: 2, boardCol: 2, cellRow: 1, cellCol: 1 };
    const res = g.tryApplyMove(illegal);

    expect(res).toBeNull();
  });
});
