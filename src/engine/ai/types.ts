import type { Move } from "../index.js";
import type { Game } from "../Game.js";

export type BotId = "billy-random";

export interface Bot {
  id: BotId;
  name: string;
  description: string;
  chooseMove(game: Game): Move | null;
}