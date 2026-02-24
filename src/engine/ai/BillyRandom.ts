import type { Move } from "../index.js";
import type { Game } from "../Game.js";
import type { Bot } from "./types";

export class BillyRandom implements Bot {
  id = "billy-random" as const;
  name = "Billy Random";
  description = "Plays a legal move at random. Fearless. Thoughtless.";

  chooseMove(game: Game): Move | null {
    const status = game.getStatus();
    if (status.kind !== "playing") return null;

    const moves = game.legalMoves();
    if (moves.length === 0) return null;

    const i = Math.floor(Math.random() * moves.length);
    return moves[i] ?? null;
  }
}