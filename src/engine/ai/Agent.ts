import type { Game } from "../Game.js";
import type { Move } from "../index.js";

export interface Agent {
  chooseMove(game: Game): Move | null;
}
