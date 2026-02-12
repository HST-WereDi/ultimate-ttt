import type { Agent } from "./Agent.js";
import type { Game } from "../Game.js";
import type { Move } from "../index.js";

export class RandomAgent implements Agent {
  public chooseMove(game: Game): Move | null {
    const moves = game.legalMoves();
    if (moves.length === 0) return null;
    const i = Math.floor(Math.random() * moves.length);
    return moves[i] ?? null;
  }
}
