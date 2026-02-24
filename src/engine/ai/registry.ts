import type { Bot } from "./types";
import { BillyRandom } from "./BillyRandom.js";

export const BOTS: Bot[] = [
  new BillyRandom(),
];