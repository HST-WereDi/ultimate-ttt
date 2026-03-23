import type { Bot } from "./types";
import { BillyRandom } from "./BillyRandom.js";
import { CaptainObvious } from "./CaptainObvious.js";

export const BOTS: Bot[] = [
  new BillyRandom(),
  new CaptainObvious()
];