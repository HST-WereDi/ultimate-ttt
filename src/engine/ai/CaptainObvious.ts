import type { Bot } from "./types.js";
import type { Game, Move } from "../index.js";

function countEmptyCellsInBoard(game: Game, boardRow: number, boardCol: number): number {
  let count = 0;

  for (let cellRow = 0; cellRow < 3; cellRow++) {
    for (let cellCol = 0; cellCol < 3; cellCol++) {
      if (game.getCell(boardRow, boardCol, cellRow, cellCol) === ".") {
        count++;
      }
    }
  }

  return count;
}

function scoreMove(game: Game, move: Move): number {
  let score = 0;

  // Basisvoorkeur: midden > hoek > rand
  if (move.cellRow === 1 && move.cellCol === 1) {
    score += 30;
  } else {
    const isCorner =
      (move.cellRow === 0 || move.cellRow === 2) &&
      (move.cellCol === 0 || move.cellCol === 2);

    if (isCorner) {
      score += 20;
    } else {
      score += 10;
    }
  }

  // Nieuwe heuristiek: win direct het small board
  const beforeWinner = game.board
    .getSmallBoard(move.boardRow, move.boardCol)
    .getWinner();

  const nextGame = game.applyMove(move);

  const afterWinner = nextGame.board
    .getSmallBoard(move.boardRow, move.boardCol)
    .getWinner();

  if (beforeWinner === null && afterWinner === game.currentPlayer) {
    score += 1000;
  }

    const targetBoard = nextGame.board.nextBoard;

  if (targetBoard === null) {
    // Tegenstander mag overal spelen: meestal ongunstig
    score -= 40;
  } else {
    const emptyCells = countEmptyCellsInBoard(nextGame, targetBoard.row, targetBoard.col);

    // Hoe minder vrije vakjes daar nog zijn, hoe beter
    score += (9 - emptyCells) * 5;
  }

  return score;
}

export const CaptainObvious: Bot = {
  id: "captain-obvious",
  name: "Captain Obvious",
  description: "Only looks as far as his nose is long.",

  chooseMove(game: Game): Move {
    const moves = game.legalMoves();

    if (moves.length === 0) {
      throw new Error("Captain Obvious: geen legale zetten.");
    }

    let bestScore = -Infinity;
    let bestMoves: Move[] = [];

    for (const move of moves) {
      const score = scoreMove(game, move);

      if (score > bestScore) {
        bestScore = score;
        bestMoves = [move];
      } else if (score === bestScore) {
        bestMoves.push(move);
      }
    }

    if (bestMoves.length === 0) {
      throw new Error("Captain Obvious: geen beste zet gevonden.");
    }

    const index = Math.floor(Math.random() * bestMoves.length);
    const chosenMove = bestMoves[index];

    if (!chosenMove) {
      throw new Error("Captain Obvious: gekozen zet is undefined.");
    }

    return chosenMove;
  },
};