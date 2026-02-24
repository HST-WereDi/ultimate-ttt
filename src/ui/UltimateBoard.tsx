import React, { useEffect, useMemo, useState } from "react";
import { Game } from "../engine/Game.js";
import type { Move } from "../engine/index.js";
import { BoardView } from "./BoardView";
import { GameScreen } from "./GameScreen";

export function UltimateBoard({ onBack }: { onBack?: () => void }) {
  const [game, setGame] = useState(() => new Game());
  const view = useMemo(() => game.getView(), [game]);
  const [showDebug, setShowDebug] = useState(false);

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

  const shouldShowModal = isOver && showResult;

  function handleClick(move: Move) {
    const next = game.tryApplyMove(move);
    if (next) setGame(next);
  }

  function reset() {
    setGame(new Game());
    setShowResult(true);
  }

  function playRandomMoves(count: number) {
    setGame((prev) => {
      let g = prev;

      for (let i = 0; i < count; i++) {
        if (g.getStatus().kind !== "playing") break;

        const moves = g.legalMoves();
        if (moves.length === 0) break;

        const pick = moves[Math.floor(Math.random() * moves.length)];
        if (!pick) break;

        const next = g.tryApplyMove(pick);
        if (!next) break;
        g = next;
      }

      return g;
    });
  }

  function playToEnd(maxPlies: number = 300) {
    playRandomMoves(maxPlies);
  }

    const turnText = view.currentPlayer === "X"
      ? "makes their move"
      : "makes their move";

return (
    <GameScreen
      view={view}
      title="Local Multiplayer"
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
