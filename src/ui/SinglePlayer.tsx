import React, { useEffect, useMemo, useState } from "react";
import { Game } from "../engine/Game.js";
import type { Move, Mark } from "../engine/index.js";
import { BoardView } from "./BoardView";
import { BOTS } from "../engine/ai/registry.js";
import type { BotId } from "../engine/ai/types";
import { GameScreen } from "./GameScreen";

export function SinglePlayer({
  onBack,
  botId,
}: {
  onBack?: () => void;
  botId: BotId;
}) {
  const [game, setGame] = useState(() => new Game());
  const view = useMemo(() => game.getView(), [game]);

  const bot = useMemo(() => {
    const found = BOTS.find((b) => b.id === botId);
    if (!found) throw new Error(`Unknown bot: ${botId}`);
    return found;
  }, [botId]);

  const human: Exclude<Mark, "."> = "X";
  const ai: Exclude<Mark, "."> = "O";

  const isOver = view.status.kind !== "playing";

  const winnerText =
    view.status.kind === "won"
      ? `Winner: ${view.status.winner}`
      : view.status.kind === "draw"
      ? "Draw"
      : "";

  const [showResult, setShowResult] = useState(true);

  useEffect(() => {
    if (isOver) setShowResult(true);
  }, [isOver]);

  // AI speelt automatisch als het AI's beurt is
  useEffect(() => {
    if (isOver) return;
    if (view.currentPlayer !== ai) return;

    const move = bot.chooseMove(game);
    if (!move) return;

    const t = window.setTimeout(() => {
      const next = game.tryApplyMove(move);
      if (next) setGame(next);
    }, 1000);

    return () => window.clearTimeout(t);
  }, [ai, bot, game, isOver, view.currentPlayer]);

  function handleHumanClick(move: Move) {
    if (isOver) return;
    if (view.currentPlayer !== human) return;

    const next = game.tryApplyMove(move);
    if (next) setGame(next);
  }

  function reset() {
    setGame(new Game());
    setShowResult(true);
  }

  const shouldShowModal = isOver && showResult;

    const subline = view.nextBoard
    ? `Volgend miniboard: (${view.nextBoard.row}, ${view.nextBoard.col})`
    : "Vrije keuze";

    const aiTurn = view.currentPlayer === ai && !isOver;
    const subtitle = `vs ${bot.name}`;

    const turnText = aiTurn
    ? `${bot.name} makes their move`
    : "Your move";

    return (
    <GameScreen
        view={view}
        title="Single Player"
        subtitle={subtitle}
        onMove={handleHumanClick}
        onReset={reset}
        {...(onBack ? { onBack } : {})}
        boardDisabled={aiTurn}
        showResult={showResult}
        onCloseResult={() => setShowResult(false)}
        resultText={winnerText}
        turnText={turnText}
    />
    );
}