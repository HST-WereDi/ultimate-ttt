import React, { useEffect, useMemo, useState } from "react";
import { Game } from "../engine/Game.js";
import type { Move } from "../engine/index.js";
import { GameScreen } from "./GameScreen";

export function UltimateBoard({ onBack }: { onBack?: () => void }) {
  const [game, setGame] = useState(() => new Game());
  const view = useMemo(() => game.getView(), [game]);

  const isOver = view.status.kind !== "playing";

  const winnerText =
    view.status.kind === "won"
      ? `Winner: ${view.status.winner}`
      : view.status.kind === "draw"
      ? "Draw"
      : "";

  const [showResult, setShowResult] = useState(true);

  // Als het spel eindigt (win/draw), forceer modal weer open
  useEffect(() => {
    if (isOver) setShowResult(true);
  }, [isOver]);

  function handleClick(move: Move) {
    const next = game.tryApplyMove(move);
    if (next) setGame(next);
  }

  function reset() {
    setGame(new Game());
    setShowResult(true);
  }

  const turnText = "makes their move";

return (
    <GameScreen
      view={view}
      onMove={handleClick}
      onReset={reset}
      {...(onBack ? { onBack } : {})}
      showResult={showResult}
      onCloseResult={() => setShowResult(false)}
      resultText={winnerText}
      turnText={turnText}
    />
  );
}
